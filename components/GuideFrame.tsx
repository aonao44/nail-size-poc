export default function GuideFrame() {
  // 500円玉=厳密な円ガイド（スケール基準）／爪=ゆるいゾーン指示。
  // viewBox は 3:4 = 300×400。
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="tz-vignette" cx="50%" cy="50%" r="60%">
            <stop offset="40%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill="url(#tz-vignette)" />

        {/* 4隅コーナーマーク */}
        <g
          stroke="oklch(72% 0.07 18)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        >
          <path d="M22 46 L22 22 L46 22" />
          <path d="M254 22 L278 22 L278 46" />
          <path d="M22 354 L22 378 L46 378" />
          <path d="M254 378 L278 378 L278 354" />
        </g>

        {/* ── 爪ゾーン（左）── ゆるい配置ヒント。形は合わせない */}
        <g>
          {/* 半透明のソフトゾーン */}
          <rect
            x="46"
            y="140"
            width="82"
            height="150"
            rx="20"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
          {/* 爪先の向きを示す上向き矢印 */}
          <g
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="87" y1="180" x2="87" y2="160" />
            <path d="M80 167 L87 160 L94 167" />
          </g>
          {/* ラベル */}
          <g>
            <rect
              x="54"
              y="298"
              width="66"
              height="20"
              rx="10"
              fill="rgba(10,6,7,0.55)"
            />
            <text
              x="87"
              y="312"
              textAnchor="middle"
              fontSize="10"
              fill="#fff"
              fontFamily="var(--font-noto-sans-jp), sans-serif"
              fontWeight={500}
              letterSpacing="1"
            >
              指をここに
            </text>
          </g>
        </g>

        {/* ── 500円玉 合わせ線（右）── ピッタリ合わせる基準 */}
        <g>
          {/* 外円（¥500の縁にピッタリ合わせる） */}
          <circle
            cx="205"
            cy="210"
            r="62"
            fill="oklch(78% 0.06 80 / 0.05)"
            stroke="oklch(72% 0.07 18)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          {/* 内円（位置合わせ補助） */}
          <circle
            cx="205"
            cy="210"
            r="54"
            fill="none"
            stroke="oklch(72% 0.07 18 / 0.35)"
            strokeWidth="0.9"
            strokeDasharray="2 3"
          />
          {/* 中央十字 */}
          <g stroke="rgba(255,255,255,0.6)" strokeWidth="0.9">
            <line x1="205" y1="198" x2="205" y2="222" />
            <line x1="193" y1="210" x2="217" y2="210" />
          </g>
          {/* ¥500 ラベル */}
          <text
            x="205"
            y="186"
            textAnchor="middle"
            fontSize="10.5"
            fill="oklch(72% 0.07 18)"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1"
          >
            ¥500
          </text>
          {/* スケール補助 */}
          <text
            x="205"
            y="238"
            textAnchor="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.55)"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1"
          >
            26.5mm
          </text>
        </g>

        {/* キャプション（下部） */}
        <g>
          <rect
            x="34"
            y="340"
            width="232"
            height="32"
            rx="16"
            fill="rgba(10,6,7,0.6)"
          />
          <text
            x="150"
            y="354"
            textAnchor="middle"
            fontSize="11"
            fill="#fff"
            fontFamily="var(--font-noto-sans-jp), sans-serif"
            fontWeight={600}
          >
            500円玉を円にピッタリ合わせる
          </text>
          <text
            x="150"
            y="366"
            textAnchor="middle"
            fontSize="9.5"
            fill="rgba(255,255,255,0.65)"
            fontFamily="var(--font-noto-sans-jp), sans-serif"
          >
            爪は左エリアに置くだけでOK
          </text>
        </g>
      </svg>
    </div>
  );
}
