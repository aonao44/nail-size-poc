type Props = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  onBack?: () => void;
  backLabel?: string;
};

const ink = "#2A2326";
const inkSoft = "#6B5F63";
const line = "rgba(42,35,38,0.08)";
const roseDeep = "oklch(58% 0.09 18)";
const roseTint = "oklch(97% 0.012 20)";

export default function ErrorView({
  title,
  message,
  onRetry,
  retryLabel = "再試行",
  onBack,
  backLabel = "最初に戻る",
}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(80% 60% at 20% 0%, oklch(96% 0.015 20) 0%, transparent 50%), radial-gradient(70% 50% at 100% 100%, oklch(95% 0.02 30) 0%, transparent 55%), #FBF8F6",
        color: ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: roseTint,
            color: roseDeep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16v.01" />
          </svg>
        </div>

        <h2
          className="tz-serif"
          style={{
            fontWeight: 500,
            fontSize: 22,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: inkSoft,
            lineHeight: 1.75,
          }}
        >
          {message}
        </p>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 8,
          }}
        >
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                width: "100%",
                height: 56,
                borderRadius: 18,
                border: 0,
                background: ink,
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.02em",
                cursor: "pointer",
                boxShadow: "0 10px 24px -12px rgba(42,35,38,0.45)",
              }}
            >
              {retryLabel}
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 18,
                border: `1px solid ${line}`,
                background: "transparent",
                color: ink,
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {backLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
