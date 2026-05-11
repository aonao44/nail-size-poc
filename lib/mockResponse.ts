import type { EstimateResponse } from "@/types";

export const MOCK_ESTIMATE: EstimateResponse = {
  width_mm: 9.5,
  length_mm: 16,
  confidence: 1,
  notes: "モックデータ（GEMINI_API_KEY未設定 or USE_MOCK=true）",
};
