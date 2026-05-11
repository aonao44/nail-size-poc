"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/CameraCapture";
import GuideFrame from "@/components/GuideFrame";
import ErrorView from "@/components/ErrorView";

type Step = "capture" | "preview";

function HeaderButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        border: 0,
        background: "rgba(255,255,255,0.08)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {children}
    </button>
  );
}

function DarkHeader({
  onBack,
  title,
  eyebrow,
}: {
  onBack: () => void;
  title: string;
  eyebrow: string;
}) {
  return (
    <div
      style={{
        padding: "14px 20px 14px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <HeaderButton onClick={onBack} ariaLabel="戻る">
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M11 5l-7 7 7 7" />
        </svg>
      </HeaderButton>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 2,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
          {title}
        </div>
      </div>
      <HeaderButton ariaLabel="フラッシュ">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
        </svg>
      </HeaderButton>
    </div>
  );
}

export default function CapturePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("capture");
  const [imageTop, setImageTop] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  if (permissionError !== null) {
    return (
      <div className="max-w-md mx-auto w-full">
        <ErrorView
          title="カメラを起動できません"
          message={`${permissionError}。設定からカメラ権限を許可してください。`}
          onBack={() => router.push("/")}
          backLabel="トップへ戻る"
        />
      </div>
    );
  }

  if (step === "capture") {
    return (
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          background: "#0F0B0C",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DarkHeader
          onBack={() => router.push("/")}
          eyebrow="TOP VIEW · 上から撮影"
          title="爪と500円玉"
        />
        <CameraCapture
          guideFrame={<GuideFrame />}
          onCapture={(b) => {
            setImageTop(b);
            setStep("preview");
          }}
          onPermissionDenied={setPermissionError}
        />
      </div>
    );
  }

  if (step === "preview" && imageTop !== null) {
    const handleAnalyze = () => {
      sessionStorage.setItem("imageTop", imageTop);
      router.push("/result");
    };

    return (
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          background: "#0F0B0C",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DarkHeader
          onBack={() => {
            setImageTop(null);
            setStep("capture");
          }}
          eyebrow="PREVIEW · 撮影確認"
          title="この画像で解析しますか？"
        />

        <div
          className="relative mx-4 rounded-3xl overflow-hidden flex-1 min-h-0"
          style={{ background: "#1A1214" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${imageTop}`}
            alt="真上から撮影した爪のプレビュー"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="px-6 pt-4 pb-6" style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => {
              setImageTop(null);
              setStep("capture");
            }}
            style={{
              flex: 1,
              height: 54,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontFamily: "inherit",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
            撮り直し
          </button>
          <button
            onClick={handleAnalyze}
            style={{
              flex: 1.3,
              height: 54,
              borderRadius: 16,
              border: 0,
              background: "#fff",
              color: "#2A2326",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 8px 24px -8px rgba(0,0,0,0.4)",
            }}
          >
            解析する
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
