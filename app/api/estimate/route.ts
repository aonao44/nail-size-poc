export const runtime = "nodejs";
export const maxDuration = 60;

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ESTIMATION_PROMPT } from "@/lib/geminiPrompt";
import { MOCK_ESTIMATE } from "@/lib/mockResponse";
import type { EstimateRequest, EstimateResponse, EstimateError } from "@/types";

export async function POST(req: Request): Promise<Response> {
  // リクエストbodyパース
  let body: EstimateRequest;
  try {
    body = await req.json();
  } catch (e) {
    console.error("[estimate] body parse error:", e);
    return Response.json(
      { error: "リクエスト形式が不正です", retryable: false } satisfies EstimateError,
      { status: 400 }
    );
  }

  const { imageTop } = body;

  // バリデーション
  if (typeof imageTop !== "string" || imageTop.length === 0) {
    return Response.json(
      { error: "imageTop が不正です", retryable: false } satisfies EstimateError,
      { status: 400 }
    );
  }

  // モックモード
  if (process.env.USE_MOCK === "true") {
    return Response.json(MOCK_ESTIMATE satisfies EstimateResponse, { status: 200 });
  }

  // APIキー確認
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[estimate] GEMINI_API_KEY が未設定です");
    return Response.json(
      { error: "GEMINI_API_KEY が未設定です", retryable: false } satisfies EstimateError,
      { status: 500 }
    );
  }

  // Gemini 503 (過負荷) を自動リトライ（最大2回、指数バックオフ）
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  const contents = [
    ESTIMATION_PROMPT,
    { inlineData: { data: imageTop, mimeType: "image/jpeg" } },
  ];

  const MAX_RETRIES = 2;
  const TOTAL_TIMEOUT_MS = 28000; // Cloudflare Workers 30秒制限に少し余裕
  const startedAt = Date.now();

  let rawText: string | undefined;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const elapsed = Date.now() - startedAt;
    const remaining = TOTAL_TIMEOUT_MS - elapsed;
    if (remaining <= 0) {
      lastError = new Error("TIMEOUT");
      break;
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), remaining)
      );
      const result = await Promise.race([
        model.generateContent(contents),
        timeoutPromise,
      ]);
      rawText = result.response.text();
      break; // 成功
    } catch (e: unknown) {
      lastError = e;

      const isTimeout = e instanceof Error && e.message === "TIMEOUT";
      if (isTimeout) break; // タイムアウトはリトライせず即終了

      // 503 過負荷 or ネットワーク系ならリトライ
      const is503 =
        typeof e === "object" &&
        e !== null &&
        "status" in e &&
        (e as { status: unknown }).status === 503;
      const errMsg = e instanceof Error ? e.message : String(e);
      const isTransient = is503 || /503|overload|unavail/i.test(errMsg);

      if (!isTransient || attempt === MAX_RETRIES) break;

      // バックオフ: 500ms, 1500ms
      const backoffMs = 500 * Math.pow(3, attempt);
      console.warn(
        `[estimate] Gemini 503 retry ${attempt + 1}/${MAX_RETRIES} in ${backoffMs}ms`
      );
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }

  if (rawText === undefined) {
    const isTimeout =
      lastError instanceof Error && lastError.message === "TIMEOUT";
    if (isTimeout) {
      console.error("[estimate] Gemini timeout");
      return Response.json(
        { error: "解析がタイムアウトしました", retryable: true } satisfies EstimateError,
        { status: 504 }
      );
    }
    console.error("[estimate] Gemini API error:", lastError);
    return Response.json(
      { error: "解析に失敗しました。しばらく待って再試行してください", retryable: true } satisfies EstimateError,
      { status: 502 }
    );
  }

  // JSONパース & 必須フィールド検証
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    console.error("[estimate] JSON parse error. raw text:", rawText, e);
    return Response.json(
      { error: "解析結果の解釈に失敗しました", retryable: true } satisfies EstimateError,
      { status: 502 }
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).width_mm !== "number" ||
    typeof (parsed as Record<string, unknown>).length_mm !== "number"
  ) {
    console.error("[estimate] Missing required fields. parsed:", parsed);
    return Response.json(
      { error: "解析結果の解釈に失敗しました", retryable: true } satisfies EstimateError,
      { status: 502 }
    );
  }

  return Response.json(parsed as EstimateResponse, { status: 200 });
}
