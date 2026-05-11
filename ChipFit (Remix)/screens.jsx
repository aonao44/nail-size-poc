// Tsumelier — screens (pink edition, single-capture)

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Shared tokens — warm off-white + dusty rose accent
// ─────────────────────────────────────────────────────────────
const tz = {
  bg:       '#FBF8F6',
  ink:      '#2A2326',
  inkSoft:  '#6B5F63',
  inkMute:  '#9A8F93',
  line:     'rgba(42,35,38,0.08)',
  lineSoft: 'rgba(42,35,38,0.05)',
  rose:     'oklch(72% 0.07 18)',
  roseDeep: 'oklch(58% 0.09 18)',
  roseSoft: 'oklch(94% 0.02 20)',
  roseTint: 'oklch(97% 0.012 20)',
  gold:     'oklch(78% 0.06 80)',
};

function Ico({ d, size = 20, sw = 1.6, fill = 'none', extra }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {typeof d === 'string' ? <path d={d} /> : d}
      {extra}
    </svg>
  );
}
const I = {
  Camera:   (p) => <Ico {...p} d={<><path d="M14.5 4h-5L7.5 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.5L14.5 4Z"/><circle cx="12" cy="13" r="3.5"/></>} />,
  Sparkle:  (p) => <Ico {...p} d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm6 11l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14Z" />,
  Ruler:    (p) => <Ico {...p} d={<><path d="M3 15l6 6 12-12-6-6L3 15Z"/><path d="M7 11l2 2M10 8l2 2M13 5l2 2M5 13l2 2"/></>} />,
  Coin:     (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-4m0 0v2.5m0-2.5h4a1.5 1.5 0 0 1 0 3h-4"/></>} />,
  Check:    (p) => <Ico {...p} d="M4 12l5 5L20 6" />,
  ArrowR:   (p) => <Ico {...p} d="M5 12h14M13 5l7 7-7 7" />,
  ArrowL:   (p) => <Ico {...p} d="M19 12H5M11 5l-7 7 7 7" />,
  X:        (p) => <Ico {...p} d="M6 6l12 12M18 6L6 18" />,
  Rotate:   (p) => <Ico {...p} d={<><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></>} />,
  Info:     (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></>} />,
  Search:   (p) => <Ico {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  Flash:    (p) => <Ico {...p} d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  Shield:   (p) => <Ico {...p} d={<><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></>} />,
};

function Notice({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(42,35,38,0.03)',
      color: tz.inkSoft, fontSize: 11.5, lineHeight: 1.65,
    }}>
      <span style={{ flexShrink: 0, color: tz.inkMute, marginTop: 1 }}>
        <I.Info size={14} sw={1.5} />
      </span>
      <span>{children}</span>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 56, borderRadius: 18, border: 0,
      background: disabled ? 'rgba(42,35,38,0.08)' : tz.ink,
      color: disabled ? tz.inkMute : '#fff',
      fontFamily: 'inherit', fontWeight: 600, fontSize: 15, letterSpacing: '0.02em',
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: disabled ? 'none' : '0 10px 24px -12px rgba(42,35,38,0.45)',
    }}>{children}</button>
  );
}
function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 52, borderRadius: 18, border: `1px solid ${tz.line}`,
      background: 'transparent', color: tz.ink,
      fontFamily: 'inherit', fontWeight: 500, fontSize: 14,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  );
}

// ═════════════════════════════════════════════════════════════
// 1 · TOP
// ═════════════════════════════════════════════════════════════
function TopScreen({ onStart }) {
  const steps = [
    { n: '01', t: '撮影', s: '500円玉と爪を並べて、上から一枚', ico: <I.Camera size={18} /> },
    { n: '02', t: 'AI解析', s: 'コインを基準に爪の寸法を推定', ico: <I.Sparkle size={18} /> },
    { n: '03', t: 'サイズ提案', s: '10段階からあなたの最適を提示', ico: <I.Ruler size={18} /> },
  ];

  return (
    <div style={{
      flex: 1, minHeight: 0, background: tz.bg, color: tz.ink,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      <div style={{ padding: '12px 24px 28px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -40, right: -80, width: 260, height: 260,
          borderRadius: '50%', background: tz.roseSoft, filter: 'blur(8px)',
          opacity: 0.8, pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 36, position: 'relative' }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: tz.rose, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
            fontFamily: 'Noto Serif JP, serif',
          }}>T</div>
          <span style={{ fontWeight: 600, letterSpacing: '0.08em', fontSize: 13 }}>Tsumelier</span>
          <span style={{
            marginLeft: 'auto', fontSize: 10, color: tz.inkMute,
            border: `1px solid ${tz.line}`, padding: '3px 8px', borderRadius: 99,
            letterSpacing: '0.1em',
          }}>BETA</span>
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.3em', color: tz.rose,
            margin: 0, marginBottom: 14, fontWeight: 500,
          }}>NAIL CHIP SIZING · AI</p>
          <h1 style={{
            fontFamily: 'Noto Serif JP, serif', fontWeight: 500,
            fontSize: 34, lineHeight: 1.35, letterSpacing: '0.01em',
            margin: 0, marginBottom: 18,
          }}>
            撮るだけで、<br/>
            <span style={{ color: tz.roseDeep }}>ぴったりの</span>ネイルチップ<br/>サイズを。
          </h1>
          <p style={{
            fontSize: 14, lineHeight: 1.8, color: tz.inkSoft,
            margin: 0, maxWidth: 300,
          }}>
            500円玉と一緒に爪を撮影すると、AI があなたの指に合うサイズを
            <span style={{ color: tz.ink }}>1〜2分</span>で提案します。
          </p>
        </div>
      </div>

      <div style={{ padding: '0 24px 32px' }}>
        <div style={{
          borderRadius: 24, overflow: 'hidden', position: 'relative',
          background: `linear-gradient(160deg, ${tz.roseTint} 0%, #fff 50%, ${tz.roseSoft} 100%)`,
          height: 180, border: `1px solid ${tz.line}`,
          boxShadow: '0 16px 40px -24px rgba(140, 90, 95, 0.25)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(181,142,148,0.06) 0 6px, transparent 6px 14px)',
          }} />
          <svg viewBox="0 0 320 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <rect x="110" y="40" width="60" height="150" rx="30" fill="#F0DCDA" stroke="rgba(42,35,38,0.08)" />
            <ellipse cx="140" cy="70" rx="22" ry="28" fill="#FCEDE9"
              stroke="oklch(72% 0.07 18 / 0.4)" strokeWidth="1" />
            <circle cx="230" cy="95" r="40" fill="#E8D9A8"
              stroke="oklch(78% 0.06 80 / 0.6)" strokeWidth="1.5" />
            <circle cx="230" cy="95" r="34" fill="none"
              stroke="oklch(78% 0.06 80 / 0.4)" strokeWidth="0.8" strokeDasharray="2 3" />
            <text x="230" y="100" textAnchor="middle" fontSize="14" fontWeight="700"
              fill="oklch(55% 0.08 80)" fontFamily="Noto Serif JP, serif">500</text>
            <g stroke="oklch(58% 0.09 18 / 0.8)" strokeWidth="1" strokeDasharray="3 3">
              <line x1="118" y1="42" x2="162" y2="42" />
              <line x1="118" y1="39" x2="118" y2="45" />
              <line x1="162" y1="39" x2="162" y2="45" />
            </g>
            <text x="140" y="32" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, monospace"
              fill="oklch(58% 0.09 18)">W · 14.2mm</text>
          </svg>
        </div>
      </div>

      <div style={{ padding: '0 24px 28px' }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.2em', color: tz.inkMute,
          marginBottom: 18, fontWeight: 500,
        }}>HOW IT WORKS</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '18px 4px',
              borderBottom: i < steps.length - 1 ? `1px solid ${tz.lineSoft}` : 'none',
            }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 12,
                background: tz.roseTint, color: tz.roseDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.ico}</div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: tz.inkMute, fontFamily: 'ui-monospace, monospace' }}>{s.n}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{s.t}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: tz.inkSoft, lineHeight: 1.6 }}>{s.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          padding: '14px 16px', borderRadius: 16,
          background: tz.roseTint,
          border: `1px solid oklch(90% 0.02 20)`,
        }}>
          <div style={{ color: tz.roseDeep }}>
            <I.Coin size={22} sw={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
              なぜ500円玉?
            </div>
            <div style={{ fontSize: 11.5, color: tz.inkSoft, lineHeight: 1.55 }}>
              直径 26.5mm の正確な基準として、AIが寸法を換算します。
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 24px 20px', marginTop: 'auto' }}>
        <PrimaryBtn onClick={onStart}>
          はじめる
          <I.ArrowR size={16} sw={2} />
        </PrimaryBtn>
        <p style={{
          textAlign: 'center', margin: '16px 0 0',
          fontSize: 10.5, color: tz.inkMute, lineHeight: 1.6,
        }}>
          PoCのため測定精度は保証されません ・ 参考値としてご利用ください
        </p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 2 · CAPTURE
// ═════════════════════════════════════════════════════════════
function CaptureScreen({ onBack, onNext }) {
  const [captured, setCaptured] = useState(null);
  const [flash, setFlash] = useState(false);

  const doCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    setTimeout(() => setCaptured(true), 200);
  };

  return (
    <div style={{
      flex: 1, minHeight: 0, background: '#0F0B0C', color: '#fff',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <div style={{
        padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 14,
        position: 'relative', zIndex: 3,
      }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, border: 0,
          background: 'rgba(255,255,255,0.08)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(10px)',
        }}>
          <I.ArrowL size={18} />
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.24em',
            color: 'rgba(255,255,255,0.55)', marginBottom: 2,
          }}>TOP VIEW · 上から撮影</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
            爪と500円玉
          </div>
        </div>

        <button style={{
          width: 38, height: 38, borderRadius: 12, border: 0,
          background: 'rgba(255,255,255,0.08)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <I.Flash size={16} />
        </button>
      </div>

      <div style={{
        flex: 1, position: 'relative', margin: '4px 16px 16px',
        borderRadius: 24, overflow: 'hidden',
        background: '#1A1214',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: captured
            ? `radial-gradient(120% 100% at 40% 30%, #F0DCDA 0%, #D9B5B2 45%, #8A6A6B 100%)`
            : `radial-gradient(120% 100% at 50% 60%, #3A2A2C 0%, #1A1214 60%, #0A0607 100%)`,
        }} />

        {captured && (
          <svg viewBox="0 0 320 520" preserveAspectRatio="xMidYMid slice" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
          }}>
            <rect x="100" y="160" width="80" height="280" rx="40" fill="#F2C8C4" />
            <ellipse cx="140" cy="210" rx="30" ry="38" fill="#FDEEEA" stroke="rgba(120,60,60,0.15)" />
            <circle cx="230" cy="260" r="52" fill="#DCC98E" stroke="oklch(60% 0.06 80)" strokeWidth="2"/>
            <circle cx="230" cy="260" r="42" fill="none" stroke="oklch(55% 0.06 80 / 0.4)" strokeDasharray="2 3"/>
            <text x="230" y="267" textAnchor="middle" fontSize="18" fontWeight="700"
              fontFamily="Noto Serif JP, serif" fill="oklch(42% 0.08 80)">500</text>
          </svg>
        )}

        {!captured && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(50% 40% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
            }} />

            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 240, height: 260,
            }}>
              <svg viewBox="0 0 240 260" style={{ width: '100%', height: '100%' }}>
                {[
                  'M10 24 L10 10 L24 10',
                  'M216 10 L230 10 L230 24',
                  'M10 236 L10 250 L24 250',
                  'M216 250 L230 250 L230 236',
                ].map((d, i) =>
                  <path key={i} d={d} stroke="oklch(72% 0.07 18)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                )}
                <rect x="80" y="40" width="44" height="180" rx="22"
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="4 4" fill="none"/>
                <ellipse cx="102" cy="75" rx="16" ry="20"
                  stroke="oklch(72% 0.07 18)" strokeWidth="1.5" fill="oklch(72% 0.07 18 / 0.08)" strokeDasharray="3 3"/>
                <circle cx="180" cy="130" r="36"
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="4 4" fill="none"/>
                <text x="180" y="134" textAnchor="middle" fontSize="10"
                  fill="rgba(255,255,255,0.45)" fontFamily="ui-monospace, monospace">¥500</text>
              </svg>
            </div>

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 28,
              textAlign: 'center', padding: '0 24px',
            }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(10,6,7,0.6)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                padding: '10px 16px', borderRadius: 12,
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>
                  爪の真上から、500円玉と一緒に
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  指をまっすぐ伸ばし、カメラに対して垂直に
                </div>
              </div>
            </div>
          </>
        )}

        {flash && (
          <div style={{
            position: 'absolute', inset: 0, background: '#fff',
            animation: 'tz-flash 180ms ease-out forwards',
          }} />
        )}
      </div>

      <div style={{ padding: '8px 24px 24px', position: 'relative', zIndex: 3 }}>
        {!captured ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, padding: '8px 0',
          }}>
            <div style={{ width: 60 }} />
            <button onClick={doCapture} style={{
              width: 76, height: 76, borderRadius: '50%', border: 0,
              background: 'transparent', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2.5px solid rgba(255,255,255,0.9)',
              }} />
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: '#fff',
              }} />
            </button>
            <div style={{ width: 60, textAlign: 'center' }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.45)',
              }}>シャッター</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setCaptured(null)} style={{
              flex: 1, height: 54, borderRadius: 16, border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              fontFamily: 'inherit', fontWeight: 500, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <I.Rotate size={16} /> 撮り直し
            </button>
            <button onClick={onNext} style={{
              flex: 1.3, height: 54, borderRadius: 16, border: 0,
              background: '#fff', color: tz.ink,
              fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
            }}>
              解析する
              <I.ArrowR size={16} sw={2} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tz-flash { 0% { opacity: 0.95; } 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 3 · ANALYZING
// ═════════════════════════════════════════════════════════════
function AnalyzingScreen({ onDone }) {
  const stages = [
    '画像を取り込み中…',
    '500円玉を基準点として検出…',
    '爪の輪郭を抽出…',
    '寸法を推定しています…',
  ];
  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setIdx(i => Math.min(i + 1, stages.length - 1)), 900);
    const t2 = setInterval(() => setPct(p => Math.min(p + 1.7, 100)), 60);
    const t3 = setTimeout(onDone, 4200);
    return () => { clearInterval(t1); clearInterval(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      flex: 1, minHeight: 0, background: tz.bg, color: tz.ink,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '12px 24px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translateX(-50%)', width: 320, height: 320,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tz.roseSoft} 0%, transparent 70%)`,
        animation: 'tz-pulse 3.2s ease-in-out infinite',
      }} />

      <div style={{
        position: 'relative', marginTop: 32, marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{
          animation: 'tz-spin 8s linear infinite',
        }}>
          <circle cx="100" cy="100" r="94" fill="none"
            stroke="oklch(72% 0.07 18 / 0.22)" strokeWidth="0.8" strokeDasharray="2 6"/>
        </svg>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{
          position: 'absolute',
          animation: 'tz-spin-rev 6s linear infinite',
        }}>
          <circle cx="80" cy="80" r="74" fill="none"
            stroke="oklch(72% 0.07 18 / 0.35)" strokeWidth="1" strokeDasharray="1 4"/>
          <circle cx="80" cy="6" r="3" fill={tz.rose} />
        </svg>
        <div style={{
          position: 'absolute',
          width: 110, height: 110, borderRadius: '50%',
          background: `linear-gradient(135deg, ${tz.roseTint} 0%, #fff 100%)`,
          boxShadow: `0 20px 40px -16px oklch(72% 0.07 18 / 0.4), inset 0 0 0 1px oklch(72% 0.07 18 / 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'tz-breathe 2.4s ease-in-out infinite',
        }}>
          <div style={{ color: tz.roseDeep }}>
            <I.Sparkle size={34} sw={1.3} />
          </div>
        </div>
      </div>

      <h2 style={{
        fontFamily: 'Noto Serif JP, serif', fontWeight: 500,
        fontSize: 22, margin: '0 0 10px', letterSpacing: '0.02em',
        textAlign: 'center',
      }}>
        AIが爪を測定しています
      </h2>
      <p style={{
        fontSize: 12.5, color: tz.inkSoft, margin: '0 0 36px',
        textAlign: 'center',
      }}>
        通常 5〜10 秒ほどで完了します
      </p>

      <div style={{ width: '100%', maxWidth: 280, marginBottom: 24 }}>
        <div style={{
          height: 4, borderRadius: 99, background: 'rgba(42,35,38,0.08)',
          overflow: 'hidden', marginBottom: 18,
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${tz.rose}, ${tz.roseDeep})`,
            transition: 'width 0.1s linear',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stages.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 12, lineHeight: 1.5,
              color: i < idx ? tz.inkMute : i === idx ? tz.ink : 'rgba(42,35,38,0.25)',
              transition: 'color 300ms',
            }}>
              <div style={{
                width: 14, height: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: i < idx ? tz.roseDeep : i === idx ? tz.rose : 'rgba(42,35,38,0.2)',
              }}>
                {i < idx ? <I.Check size={12} sw={2.2} /> :
                  i === idx ?
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', background: tz.rose,
                      animation: 'tz-blink 0.9s ease-in-out infinite',
                    }} /> :
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                }
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 'auto', marginBottom: 8,
        padding: '10px 18px', borderRadius: 99,
        background: 'rgba(42,35,38,0.04)', color: tz.inkSoft,
        fontSize: 10.5, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <I.Shield size={12} sw={1.6} />
        画像は端末内でのみ処理されます
      </div>

      <style>{`
        @keyframes tz-spin { to { transform: rotate(360deg); } }
        @keyframes tz-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes tz-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes tz-pulse { 0%,100% { opacity: 0.5; transform: translateX(-50%) scale(1); } 50% { opacity: 0.8; transform: translateX(-50%) scale(1.08); } }
        @keyframes tz-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 4 · RESULT
// ═════════════════════════════════════════════════════════════
function ResultScreen({ onRetry, onShop }) {
  const sizes = [
    { n: 1,  w: 17.5, l: 21.0 },
    { n: 2,  w: 16.5, l: 20.0 },
    { n: 3,  w: 15.5, l: 19.5 },
    { n: 4,  w: 14.5, l: 18.5 },
    { n: 5,  w: 13.5, l: 17.5 },
    { n: 6,  w: 12.5, l: 16.5 },
    { n: 7,  w: 11.5, l: 15.5 },
    { n: 8,  w: 10.5, l: 14.5 },
    { n: 9,  w:  9.5, l: 13.5 },
    { n: 10, w:  8.5, l: 12.5 },
  ];
  const W = 14.2, L = 18.3;
  const recommend = 4;

  return (
    <div style={{
      flex: 1, minHeight: 0, background: tz.bg, color: tz.ink,
      display: 'flex', flexDirection: 'column', paddingBottom: 20,
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '20px 24px 12px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 99,
          background: tz.roseTint, color: tz.roseDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I.Check size={16} sw={2.2} />
        </div>
        <span style={{ fontSize: 12, color: tz.inkSoft, letterSpacing: '0.08em' }}>
          測定完了
        </span>
        <button onClick={onRetry} style={{
          marginLeft: 'auto', background: 'transparent', border: 0,
          color: tz.inkMute, fontSize: 12, cursor: 'pointer', padding: 8,
          fontFamily: 'inherit',
        }}>
          <I.X size={18} />
        </button>
      </div>

      <div style={{ padding: '4px 24px 24px' }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.28em', color: tz.rose,
          margin: 0, marginBottom: 8, fontWeight: 500,
        }}>YOUR NAIL · SHORT OVAL</p>
        <h1 style={{
          fontFamily: 'Noto Serif JP, serif', fontWeight: 500,
          fontSize: 28, lineHeight: 1.35, margin: '0 0 4px',
        }}>
          あなたにぴったりなのは<br/>
          <span style={{ color: tz.roseDeep, fontWeight: 600 }}>サイズ #{recommend}</span>
        </h1>
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        <div style={{
          borderRadius: 24, padding: '26px 24px',
          background: '#fff',
          border: `1px solid ${tz.line}`,
          boxShadow: '0 20px 40px -28px rgba(140, 90, 95, 0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -30, width: 140, height: 140,
            borderRadius: '50%', background: tz.roseTint, opacity: 0.7,
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', display: 'flex', gap: 28 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, letterSpacing: '0.22em', color: tz.inkMute, marginBottom: 8 }}>
                幅 · WIDTH
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{
                  fontFamily: 'Noto Serif JP, serif', fontWeight: 500,
                  fontSize: 44, color: tz.ink,
                }}>{W}</span>
                <span style={{ fontSize: 14, color: tz.inkSoft, fontWeight: 500 }}>mm</span>
              </div>
            </div>
            <div style={{ width: 1, background: tz.line, alignSelf: 'stretch' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, letterSpacing: '0.22em', color: tz.inkMute, marginBottom: 8 }}>
                長さ · LENGTH
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{
                  fontFamily: 'Noto Serif JP, serif', fontWeight: 500,
                  fontSize: 44, color: tz.ink,
                }}>{L}</span>
                <span style={{ fontSize: 14, color: tz.inkSoft, fontWeight: 500 }}>mm</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 20, paddingTop: 16,
            borderTop: `1px solid ${tz.lineSoft}`,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11, color: tz.inkSoft,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: 99, background: tz.rose,
            }} />
            信頼度 <strong style={{ color: tz.ink, fontWeight: 600 }}>92%</strong>
            <span style={{ color: tz.inkMute, marginLeft: 'auto' }}>2026.04.24 測定</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: tz.inkMute, fontWeight: 500 }}>
            SIZE CHART
          </div>
          <div style={{ fontSize: 10.5, color: tz.inkMute }}>
            Short Oval · 10段階
          </div>
        </div>

        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: `1px solid ${tz.line}`, background: '#fff',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 1fr 24px',
            padding: '10px 14px', background: 'rgba(42,35,38,0.025)',
            fontSize: 10, color: tz.inkMute, letterSpacing: '0.1em',
            borderBottom: `1px solid ${tz.lineSoft}`,
          }}>
            <div>SIZE</div>
            <div>幅 (mm)</div>
            <div>長さ (mm)</div>
            <div></div>
          </div>

          {sizes.map((s, i) => {
            const selected = s.n === recommend;
            return (
              <div key={s.n} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 1fr 24px',
                padding: '11px 14px', alignItems: 'center',
                background: selected ? tz.roseTint : 'transparent',
                borderBottom: i < sizes.length - 1 ? `1px solid ${tz.lineSoft}` : 'none',
                fontSize: 13, position: 'relative',
              }}>
                {selected && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    background: tz.rose,
                  }} />
                )}
                <div style={{
                  fontFamily: 'Noto Serif JP, serif',
                  fontWeight: selected ? 600 : 500,
                  color: selected ? tz.roseDeep : tz.ink,
                  fontSize: selected ? 15 : 13.5,
                }}>#{s.n}</div>
                <div style={{ color: selected ? tz.ink : tz.inkSoft, fontWeight: selected ? 600 : 400, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                  {s.w.toFixed(1)}
                </div>
                <div style={{ color: selected ? tz.ink : tz.inkSoft, fontWeight: selected ? 600 : 400, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                  {s.l.toFixed(1)}
                </div>
                <div style={{ color: selected ? tz.roseDeep : 'transparent' }}>
                  {selected && <I.Check size={14} sw={2.4} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '4px 24px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryBtn onClick={onShop}>
          <I.Search size={15} sw={2} />
          このサイズのチップを探す
        </PrimaryBtn>
        <GhostBtn onClick={onRetry}>
          <I.Rotate size={14} />
          もう一度測る
        </GhostBtn>
      </div>

      <div style={{ padding: '16px 24px 0' }}>
        <Notice>
          本結果はPoCによる参考値です。測定精度は環境・撮影条件により変動し、実寸との差異が生じる場合があります。
          購入前に各販売サイトのサイズ表と照合してください。
        </Notice>
      </div>
    </div>
  );
}

Object.assign(window, {
  TopScreen, CaptureScreen, AnalyzingScreen, ResultScreen, tz,
});
