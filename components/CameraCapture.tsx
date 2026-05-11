"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { resizeImageToBase64 } from "@/lib/resizeImage";

type Props = {
  onCapture: (base64: string) => void;
  onPermissionDenied: (error: string) => void;
  guideFrame?: React.ReactNode;
};

export default function CameraCapture({
  onCapture,
  onPermissionDenied,
  guideFrame,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "カメラ権限を確認しています..."
  );
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const [flash, setFlash] = useState(false);

  const markReady = useCallback(() => setIsVideoReady(true), []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      onPermissionDenied("カメラAPIが利用できません");
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (!cancelled && !streamRef.current) {
        onPermissionDenied(
          "カメラの起動がタイムアウトしました。ブラウザのアドレスバー付近のカメラアイコンから権限を確認してください"
        );
      }
    }, 10000);

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setStatusMessage("映像を読み込み中...");
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.setAttribute("playsinline", "true");
          video.play().catch((err: Error) => {
            console.warn("[CameraCapture] autoplay blocked:", err);
            if (!cancelled) setNeedsUserGesture(true);
          });
        }
      })
      .catch((err: Error) => {
        console.error("[CameraCapture] getUserMedia failed:", err);
        if (!cancelled)
          onPermissionDenied(err.message || "カメラへのアクセスに失敗しました");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setNeedsUserGesture(false))
      .catch((err: Error) => onPermissionDenied(err.message));
  }, [onPermissionDenied]);

  const handleCapture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || isCapturing) return;

    setIsCapturing(true);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error("toBlob failed"));
              return;
            }
            try {
              const base64 = await resizeImageToBase64(blob);
              onCapture(base64);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          "image/jpeg",
          0.95
        );
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "撮影に失敗しました";
      onPermissionDenied(message);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onCapture, onPermissionDenied]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 丸角プレビュー */}
      <div
        className="relative mx-4 rounded-3xl overflow-hidden flex-1 min-h-0"
        style={{ background: "#1A1214" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
          onLoadedMetadata={markReady}
          onCanPlay={markReady}
          onPlaying={markReady}
        />

        {guideFrame && (
          <div className="absolute inset-0 pointer-events-none">
            {guideFrame}
          </div>
        )}

        {!isVideoReady && !needsUserGesture && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 pointer-events-none">
            <div
              className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white"
              style={{ animation: "tz-spin 0.9s linear infinite" }}
            />
            <p className="text-white/80 text-sm px-4 text-center">
              {statusMessage}
            </p>
          </div>
        )}

        {needsUserGesture && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <button
              onClick={handleManualStart}
              style={{
                background: "#fff",
                color: "#2A2326",
                fontWeight: 600,
                fontSize: 14,
                padding: "14px 20px",
                borderRadius: 16,
                border: 0,
                cursor: "pointer",
              }}
            >
              タップしてカメラを開始
            </button>
          </div>
        )}

        {flash && (
          <div
            className="absolute inset-0 bg-white pointer-events-none"
            style={{ animation: "tz-flash 180ms ease-out forwards" }}
          />
        )}
      </div>

      {/* シャッター */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div style={{ width: 60 }} />
          <button
            onClick={handleCapture}
            disabled={isCapturing || !isVideoReady}
            aria-label="撮影する"
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: 0,
              background: "transparent",
              cursor: isCapturing || !isVideoReady ? "default" : "pointer",
              padding: 0,
              position: "relative",
              opacity: isCapturing || !isVideoReady ? 0.5 : 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.9)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </button>
          <div style={{ width: 60, textAlign: "center" }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              シャッター
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
