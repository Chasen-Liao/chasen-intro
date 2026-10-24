import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/RobotoMono";

const { fontFamily: serif } = loadPlayfair("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const PAPER = "#F4EFE6";
const INK = "#1A1714";
const ACCENT = "#F0652E";
const LINE = "#C9C0B2";
const MUTED = "#7d756a";
const INK_SOFT = "#3a342d";
const CYAN = "#87E1F0";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_SNAP = Easing.bezier(0.34, 1.4, 0.5, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const useLayout = () => {
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  return {
    width,
    height,
    isPortrait,
    cardCenter: isPortrait
      ? { x: width / 2, y: 1200 }
      : { x: 1420, y: 540 },
  };
};

const Grain: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN,
        opacity: 0.05,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
  );
};

const BlueprintGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = interpolate(
    frame,
    [0, 3, 5, 8, 11, 16, 110, 124],
    [0, 0.9, 0.2, 1, 0.5, 1, 1, 0],
    clamp,
  );
  const scale = interpolate(frame, [0, 132], [1.035, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity: flicker,
        scale,
        backgroundImage: `linear-gradient(rgba(26,23,20,.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26,23,20,.05) 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 66% at 50% 50%, #000 30%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 70% 66% at 50% 50%, #000 30%, transparent 100%)",
      }}
    />
  );
};

const PowerOn: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const lineY = height / 2;
  const lineScale = interpolate(frame, [0, 7], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.2, 1),
  });
  const lineOpacity = interpolate(
    frame,
    [0, 1, 7, 18],
    [0, 1, 1, 0],
    clamp,
  );
  const flash = interpolate(frame, [0, 2, 8], [0.42, 0.22, 0], clamp);

  return (
    <>
      <AbsoluteFill
        style={{
          opacity: flash,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,.9), rgba(240,101,46,.35) 30%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: lineY,
          left: 0,
          width,
          height: 1.5,
          scale: `${lineScale} 1`,
          opacity: lineOpacity,
          background: `linear-gradient(90deg, transparent, ${ACCENT} 15%, ${ACCENT} 85%, transparent)`,
          boxShadow: `0 0 22px 3px rgba(240,101,46,.5)`,
        }}
      />
    </>
  );
};

const CornerTrace: React.FC<{
  corner: "tl" | "tr" | "bl" | "br";
  delay: number;
}> = ({ corner, delay }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isPortrait = height > width;
  const size = isPortrait ? 168 : 200;
  const inset = isPortrait ? 48 : 64;
  const draw = interpolate(frame, [delay, delay + 18], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const dots = interpolate(frame, [delay + 10, delay + 22], [0, 1], clamp);

  return (
    <svg
      viewBox="0 0 144 144"
      width={size}
      height={size}
      style={{
        position: "absolute",
        top: corner.startsWith("t") ? inset : undefined,
        bottom: corner.startsWith("b") ? inset : undefined,
        left: corner.endsWith("l") ? inset : undefined,
        right: corner.endsWith("r") ? inset : undefined,
        color: LINE,
        transformOrigin: "center",
        scale: {
          tl: "1 1",
          tr: "-1 1",
          bl: "1 -1",
          br: "-1 -1",
        }[corner],
      }}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <path
          d="M14 132V40L40 14H132 M22 94V44L44 22H94"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        <path
          d="M30 82V48L48 30H82 M38 66V52L52 38H66"
          opacity={0.6}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        <path
          d="M6 64H14 M6 80H14 M6 96H14 M64 6V14 M80 6V14 M96 6V14"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </g>
      <g fill="currentColor" opacity={dots}>
        <circle cx="14" cy="132" r="2.5" />
        <circle cx="132" cy="14" r="2.5" />
        <circle cx="22" cy="94" r="2" />
        <circle cx="94" cy="22" r="2" />
        <rect x="5" y="46" width="2" height="2" />
        <rect x="5" y="112" width="2" height="2" />
        <rect x="21" y="118" width="2" height="2" />
        <rect x="29" y="103" width="2" height="2" />
        <rect x="46" y="5" width="2" height="2" />
        <rect x="112" y="5" width="2" height="2" />
        <rect x="118" y="21" width="2" height="2" />
        <rect x="103" y="29" width="2" height="2" />
      </g>
    </svg>
  );
};

const CornerTraces: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [104, 120], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity }}>
      <CornerTrace corner="tl" delay={2} />
      <CornerTrace corner="tr" delay={5} />
      <CornerTrace corner="bl" delay={8} />
      <CornerTrace corner="br" delay={11} />
    </AbsoluteFill>
  );
};

const HorizontalSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const progress = interpolate(frame, [10, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.15, 1),
  });
  const opacity = interpolate(
    frame,
    [10, 14, 28, 36],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: interpolate(progress, [0, 1], [-80, height + 80]),
        height: 2,
        opacity,
        background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 18%, ${ACCENT} 82%, transparent 100%)`,
        boxShadow: `0 0 26px 4px rgba(240,101,46,.38)`,
      }}
    />
  );
};

const VerticalSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const progress = interpolate(frame, [26, 48], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  const opacity = interpolate(frame, [26, 30, 42, 50], [0, 0.55, 0.55, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: interpolate(progress, [0, 1], [-60, width + 60]),
        width: 1,
        opacity,
        background: `linear-gradient(180deg, transparent, ${INK} 25%, ${INK} 75%, transparent)`,
      }}
    />
  );
};

const CenterMark: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [16, 28, 56, 70], [0, 1, 1, 0], clamp);
  const scale = interpolate(frame, [16, 30], [0.5, 1], {
    ...clamp,
    easing: EASE_SNAP,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: appear,
      }}
    >
      <div style={{ position: "relative", width: 240, height: 240, scale }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${LINE}`,
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -34,
            border: `1px dashed rgba(26,23,20,.22)`,
            borderRadius: "50%",
            rotate: `${frame * 0.7}deg`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1,
            height: 26,
            background: INK,
            opacity: 0.35,
            translate: "-50% -170%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1,
            height: 26,
            background: INK,
            opacity: 0.35,
            translate: "-50% 70%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 26,
            height: 1,
            background: INK,
            opacity: 0.35,
            translate: "-170% -50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 26,
            height: 1,
            background: INK,
            opacity: 0.35,
            translate: "70% -50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: ACCENT,
            translate: "-50% -50%",
            boxShadow: `0 0 12px 2px rgba(240,101,46,.6)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Kicker: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "PROFILE 001";
  const caret = frame < 52 && Math.floor(frame / 4) % 2 === 0;
  const groupOpacity = interpolate(frame, [18, 24], [0, 1], clamp);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginBottom: 26,
        fontFamily: mono,
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: "0.42em",
        color: MUTED,
        textIndent: "0.42em",
        opacity: groupOpacity,
      }}
    >
      <span style={{ color: ACCENT, opacity: 0.8 }}>[</span>
      <span style={{ display: "flex", gap: 4 }}>
        {text.split("").map((char, i) => {
          const start = 22 + i * 0.7;
          return (
            <span
              key={i}
              style={{
                opacity: interpolate(frame, [start, start + 5], [0, 1], clamp),
                display: "inline-block",
              }}
            >
              {char === " " ? " " : char}
            </span>
          );
        })}
      </span>
      <span style={{ color: ACCENT, opacity: caret ? 0.9 : frame < 52 ? 0.25 : 0 }}>|</span>
      <span style={{ color: ACCENT, opacity: 0.8 }}>]</span>
    </div>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const letters = "Chasen".split("");
  const split = interpolate(frame, [36, 58], [7, 0], clamp);
  const splitAlpha = (split / 7) * 0.3;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: serif,
        fontSize: 232,
        fontWeight: 600,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: INK,
        textShadow: `${split}px 0 rgba(240,101,46,${splitAlpha}), ${-split * 0.7}px 0 rgba(135,225,240,${splitAlpha * 0.8})`,
        scale: interpolate(frame, [50, 58, 66], [1, 1.035, 1], {
          ...clamp,
          easing: EASE_OUT,
        }),
      }}
    >
      {letters.map((letter, i) => {
        const start = 34 + i * 1.6;
        const rise = interpolate(frame, [start, start + 16], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0px ${(1 - rise) * 250}px`,
              }}
            >
              {letter}
            </span>
          </span>
        );
      })}
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: ACCENT,
          marginLeft: 10,
          marginTop: 22,
          scale: interpolate(frame, [54, 66], [0, 1], {
            ...clamp,
            easing: EASE_SNAP,
          }),
          boxShadow: `0 0 18px 3px rgba(240,101,46,.35)`,
        }}
      />
    </div>
  );
};

const Rule: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        height: 1,
        width: 520,
        background: INK,
        opacity: 0.28,
        marginTop: 34,
        scale: interpolate(frame, [60, 76], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        }),
      }}
    />
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const tracking = interpolate(frame, [68, 90], [0.55, 0.3], {
    ...clamp,
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        marginTop: 28,
        fontFamily: mono,
        fontSize: 24,
        fontWeight: 400,
        letterSpacing: `${tracking}em`,
        textIndent: `${tracking}em`,
        color: INK,
        opacity: interpolate(frame, [68, 86], [0, 1], clamp),
      }}
    >
      AI / AGENT BUILDER · GUANGZHOU
    </div>
  );
};

const TextBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait } = useLayout();
  const shift = interpolate(frame, [60, 90], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const scale = interpolate(frame, [60, 90], [1, isPortrait ? 0.86 : 0.76], {
    ...clamp,
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        translate: isPortrait
          ? `0px ${shift * -364}px`
          : `${shift * -340}px 0px`,
        scale,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Kicker />
        <Wordmark />
        <Rule />
        <Subtitle />
      </div>
    </AbsoluteFill>
  );
};

const PortraitCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: canvasWidth, isPortrait, cardCenter } = useLayout();
  const enter = interpolate(frame, [64, 100], [0, 1], {
    ...clamp,
    easing: EASE_SNAP,
  });
  const idle = Math.max(0, frame - 100);
  const sway = Math.sin(idle / 26) * 2.2;

  const shineX = interpolate(frame, [96, 120], [-20, 120], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const foilOpacity = interpolate(
    frame,
    [88, 98, 112, 126],
    [0.12, 0.46, 0.46, 0.16],
    clamp,
  );

  const width = isPortrait ? 440 : 400;
  const height = width * (4 / 3);
  const left = isPortrait
    ? canvasWidth / 2 - width / 2
    : cardCenter.x - width / 2;
  const top = cardCenter.y - height / 2;

  const glow = interpolate(frame, [62, 92, 100], [0, 0.9, 0.35], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        perspective: 1100,
        opacity: interpolate(frame, [64, 76], [0, 1], clamp),
      }}
    >
      {/* 入场拖影框 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          border: `1px solid ${ACCENT}`,
          opacity: (1 - clamp01(enter)) * 0.3,
          translate: isPortrait ? "0px 28px" : "-28px 0px",
          scale: 1.02,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 20,
          background: `linear-gradient(135deg, ${LINE}, ${CYAN} 28%, #F599AD 54%, #d8bd91 76%, ${LINE})`,
          boxShadow: `0 ${24 + glow * 10}px ${44 + glow * 18}px -20px rgba(26,23,20,${0.3 + glow * 0.08}), 0 4px 10px rgba(26,23,20,.08), 0 0 ${glow * 46}px rgba(240,101,46,${glow * 0.22})`,
          transform: isPortrait
            ? `perspective(1100px) rotateX(${(1 - enter) * -88 - 2}deg) rotateY(${sway}deg) translateY(${(1 - enter) * 190}px) scale(${0.86 + enter * 0.14})`
            : `perspective(1100px) rotateY(${(1 - enter) * -92 + sway}deg) rotateX(${(1 - enter) * 14 - 2}deg) translateX(${(1 - enter) * 180}px) scale(${0.86 + enter * 0.14})`,
        }}
      >
        {/* 内层纸面 + 蓝图网格 */}
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 19,
            overflow: "hidden",
            background: `linear-gradient(rgba(201,192,178,.18) 1px, transparent 1px) 0 0 / 100% 24px,
              linear-gradient(90deg, rgba(201,192,178,.18) 1px, transparent 1px) 0 0 / 24px 100%,
              ${PAPER}`,
            border: "1px solid rgba(244,239,230,.85)",
          }}
        >
          {/* 头像区 */}
          <div
            style={{
              position: "absolute",
              inset: "52px 14px 94px",
              overflow: "hidden",
              background: PAPER,
            }}
          >
            <Img
              src={staticFile("avatar.png")}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: "translate(-50%, -50%)",
                mixBlendMode: "multiply",
              }}
            />
          </div>

          {/* 全息箔 + 眩光 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: foilOpacity,
              mixBlendMode: "color",
              background: `repeating-linear-gradient(115deg, ${CYAN} 0%, #b8d6b4 12%, #e8c6a1 24%, #F599AD 36%, #c6c8ea 48%, ${CYAN} 60%)`,
              backgroundSize: "220% 220%",
              WebkitMaskImage: `radial-gradient(ellipse at ${shineX}% 42%, #000 5%, rgba(0,0,0,.65) 35%, transparent 75%)`,
              maskImage: `radial-gradient(ellipse at ${shineX}% 42%, #000 5%, rgba(0,0,0,.65) 35%, transparent 75%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.16,
              mixBlendMode: "screen",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.60), rgba(255,255,255,.12) 22%, transparent 45%)",
            }}
          />

          {/* 划过卡片的镜面高光 */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: "-30%",
                bottom: "-30%",
                left: `${interpolate(frame, [98, 120], [-70, 150], clamp)}%`,
                width: "38%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)",
                rotate: "10deg",
                mixBlendMode: "screen",
                opacity: interpolate(
                  frame,
                  [98, 104, 116, 122],
                  [0, 0.55, 0.55, 0],
                  clamp,
                ),
                filter: "blur(6px)",
              }}
            />
          </div>

          {/* 内框 */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid rgba(26,23,20,.18)",
              borderRadius: 12,
            }}
          />

          {/* 橙色十字准星 */}
          <div
            style={{
              position: "absolute",
              top: 58,
              left: 20,
              width: 20,
              height: 20,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 20,
                height: 1,
                background: ACCENT,
                opacity: 0.65,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1,
                height: 20,
                background: ACCENT,
                opacity: 0.65,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: 20,
              bottom: 102,
              width: 20,
              height: 20,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 1,
                background: ACCENT,
                opacity: 0.65,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 1,
                height: 20,
                background: ACCENT,
                opacity: 0.65,
              }}
            />
          </div>

          {/* 顶部状态 */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 26,
              right: 26,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: mono,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                color: ACCENT,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: ACCENT,
                  opacity: 0.55 + Math.sin(frame / 6) * 0.35,
                }}
              />
              AVAILABLE
            </span>
            <span style={{ color: INK_SOFT }}>AVATAR / 01</span>
          </div>

          {/* 底部标签 */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 26,
              right: 26,
              borderTop: `1px solid ${LINE}`,
              paddingTop: 12,
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: "0.1em",
              lineHeight: 1.6,
              color: MUTED,
            }}
          >
            <b
              style={{
                display: "block",
                marginBottom: 6,
                fontFamily: serif,
                fontSize: 38,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              Chasen
            </b>
            AI / AGENT BUILDER
            <br />
            N 23°08′ E 113°15′ · GUANGZHOU
          </div>
        </div>
      </div>
    </div>
  );
};

const Shake: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const impulse = (at: number, amp: number, length: number) => {
    const t = frame - at;
    if (t < 0 || t > length) return 0;
    const decay = (1 - t / length) ** 2;
    return Math.sin(t * 1.7) * amp * decay;
  };
  const x = impulse(58, 6, 16) + impulse(96, 9, 18);
  const y = impulse(58, 3.5, 16) + impulse(96, 5.5, 18);

  return (
    <AbsoluteFill style={{ translate: `${x}px ${y}px` }}>{children}</AbsoluteFill>
  );
};

const ImpactFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = (at: number, strength: number) => {
    const t = frame - at;
    if (t < 0 || t > 7) return 0;
    return strength * (1 - t / 7);
  };
  const opacity = pulse(58, 0.18) + pulse(96, 0.22);

  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,.95), rgba(240,101,46,.55) 38%, transparent 72%)",
        mixBlendMode: "screen",
      }}
    />
  );
};

const ImpactRing: React.FC<{
  at: number;
  cx: number;
  cy: number;
  color: string;
  size?: number;
}> = ({ at, cx, cy, color, size = 420 }) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - at) / 22);
  if (frame < at) return null;
  const scale = 0.35 + t * 2.4;
  const opacity = (1 - t) * 0.38;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        translate: "-50% -50%",
        scale,
        opacity,
      }}
    />
  );
};

const PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 + (i % 3) * 0.35;
  return {
    angle,
    speed: 150 + (i % 7) * 34,
    size: 2 + (i % 3) * 1.6,
    color: i % 4 === 0 ? ACCENT : i % 4 === 1 ? CYAN : INK,
  };
});

const ParticleBurst: React.FC<{ at: number; cx: number; cy: number }> = ({
  at,
  cx,
  cy,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / 30);
  if (frame < at) return null;
  const ease = 1 - (1 - p) ** 3;
  const opacity = (1 - p) * 0.9;

  return (
    <AbsoluteFill style={{ opacity }}>
      {PARTICLES.map((particle, i) => {
        const distance = particle.speed * ease;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(particle.angle) * distance,
              top:
                cy +
                Math.sin(particle.angle) * distance +
                0.5 * 240 * p * p,
              width: particle.size,
              height: particle.size,
              background: particle.color,
              rotate: `${particle.angle * 57.3}deg`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const EndSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const scale = interpolate(frame, [114, 126], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.1, 1),
  });
  const opacity = interpolate(frame, [114, 120, 128, 132], [0, 0.9, 0.5, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top: height / 2,
        left: 0,
        right: 0,
        height: 2,
        scale: `${scale} 1`,
        opacity,
        background: `linear-gradient(90deg, transparent, ${ACCENT} 12%, ${ACCENT} 88%, transparent)`,
        boxShadow: `0 0 30px 5px rgba(240,101,46,.4)`,
      }}
    />
  );
};

const ExitFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [120, 132], [1, 0], clamp),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => {
  const { width, height, cardCenter } = useLayout();

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <BlueprintGrid />
      <PowerOn />
      <CenterMark />
      <CornerTraces />
      <HorizontalSweep />
      <VerticalSweep />
      <ImpactRing at={58} cx={width / 2} cy={height / 2} color={ACCENT} />
      <ImpactRing at={96} cx={cardCenter.x} cy={cardCenter.y} color={INK} />
      <ParticleBurst at={96} cx={cardCenter.x} cy={cardCenter.y} />
      <ExitFade>
        <Shake>
          <TextBlock />
          <PortraitCard />
        </Shake>
      </ExitFade>
      <ImpactFlash />
      <EndSweep />
      <Grain />
    </AbsoluteFill>
  );
};
