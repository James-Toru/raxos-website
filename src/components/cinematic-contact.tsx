"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, FastForward, Radio, X } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { preloadOperativeAssets, ThreeOperative } from "@/components/three-operative";
import {
  getOperativeEntryDuration,
  OPERATIVE_ENTRY_MIN_SECONDS,
} from "@/lib/cinematic-motion";

type CinematicPhase = "idle" | "entering" | "aiming" | "firing" | "cracked" | "blackout" | "matrix" | "modal";
type CharacterPhase = Extract<CinematicPhase, "entering" | "aiming" | "firing" | "cracked">;
type ImpactTarget = { x: number; y: number };

const phaseCopy: Record<CinematicPhase, string> = {
  idle: "CONTACT CHANNEL STANDBY",
  entering: "UNIDENTIFIED OPERATIVE DETECTED",
  aiming: "TARGETING OPTICAL SURFACE",
  firing: "IMPACT EVENT",
  cracked: "SECURE CHANNEL BREACHED",
  blackout: "VISUAL CHANNEL LOST",
  matrix: "SYSTEM RECONSTRUCTION // RAXOS",
  modal: "CONTACT CHANNEL OPEN",
};

function PlaceholderOperative({
  entryDuration,
  onArrival,
  phase,
}: {
  entryDuration: number;
  onArrival: () => void;
  phase: CharacterPhase;
}) {
  const [modelReady, setModelReady] = useState(false);

  return (
    <motion.div
      className="cinematic-operative"
      data-phase={phase}
      initial={{ x: "70vw", opacity: 0 }}
      animate={{
        x: "0%",
        opacity: 1,
        filter: "blur(0px)",
      }}
      exit={{ x: "35%", opacity: 0, filter: "blur(10px)" }}
      transition={{
        x: { duration: phase === "entering" ? entryDuration : 0.45, ease: "linear" },
        opacity: { duration: 0.32 },
        filter: { duration: 0.32 },
      }}
      onAnimationComplete={() => {
        if (phase === "entering") onArrival();
      }}
      aria-hidden="true"
    >
      <ThreeOperative phase={phase} onReady={() => setModelReady(true)} />
      <div className={`operative-scan${modelReady ? " operative-scan-ready" : ""}`} />
      <svg className={`operative-vector-fallback${modelReady ? " operative-vector-fallback-hidden" : ""}`} viewBox="0 0 360 520" role="presentation">
        <defs>
          <linearGradient id="operativeArmor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#303238" />
            <stop offset="0.42" stopColor="#090b0e" />
            <stop offset="1" stopColor="#020304" />
          </linearGradient>
          <linearGradient id="operativeEdge" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#ff4a53" />
            <stop offset="1" stopColor="#8e0008" />
          </linearGradient>
          <filter id="operativeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className="operative-shadow" fill="#000">
          <ellipse cx="238" cy="503" rx="92" ry="13" />
        </g>

        <g className="operative-leg operative-leg-back">
          <path d="M231 322 286 326 305 455 292 502 252 502 254 453Z" fill="url(#operativeArmor)" stroke="#99101a" strokeWidth="2" />
          <path d="M251 487 301 487 319 507 245 507Z" fill="#060708" stroke="#b7131d" strokeWidth="2" />
          <path d="M265 361 292 373 297 421 268 416Z" fill="#16191d" stroke="#551016" />
        </g>

        <g className="operative-leg operative-leg-front">
          <path d="M183 315 240 321 224 451 209 501 166 501 177 445Z" fill="url(#operativeArmor)" stroke="#b2121d" strokeWidth="2" />
          <path d="M166 486 215 486 231 507 153 507Z" fill="#050607" stroke="#d01822" strokeWidth="2" />
          <path d="M184 360 226 358 218 415 179 418Z" fill="#15181c" stroke="#641018" />
        </g>

        <g className="operative-body">
          <path d="M171 133 229 116 284 150 293 264 278 342 188 336 156 254Z" fill="url(#operativeArmor)" stroke="#bd1520" strokeWidth="2.5" />
          <path d="M206 148 240 137 267 157 258 208 211 213 185 179Z" fill="#171a1f" stroke="#ff2530" strokeWidth="2" />
          <path d="M193 224 276 215 282 282 260 318 196 308 176 269Z" fill="#07090b" stroke="#671119" strokeWidth="2" />
          <path d="M208 237 257 232 264 276 247 294 212 289 194 264Z" fill="none" stroke="#e31a25" strokeWidth="2" opacity=".72" />
          <path d="M228 136 221 332" fill="none" stroke="#fa1c28" strokeWidth="2" opacity=".65" />
          <path d="M179 185 154 201 161 266 188 268" fill="#090b0d" stroke="#7f1018" strokeWidth="2" />
        </g>

        <g className="operative-head">
          <path d="M184 52 214 24 257 30 279 62 267 111 236 137 196 125 174 91Z" fill="url(#operativeArmor)" stroke="#d31a24" strokeWidth="2.5" />
          <path d="M188 60 229 45 263 62 256 92 220 102 184 85Z" fill="#090b0e" stroke="#ff323d" strokeWidth="2" />
          <path d="M188 72 252 66 239 86 191 87Z" fill="#e91420" filter="url(#operativeGlow)" />
          <path d="M206 107 256 95 251 119 229 134 205 126Z" fill="#101318" stroke="#621018" />
          <circle cx="199" cy="76" r="4" fill="#fff" filter="url(#operativeGlow)" />
        </g>

        <g className="operative-weapon-arm">
          <path d="M171 160 208 174 190 223 145 205Z" fill="url(#operativeArmor)" stroke="#a8141d" strokeWidth="2" />
          <path d="M144 184 187 193 172 226 129 213Z" fill="#101317" stroke="#731018" strokeWidth="2" />
          <path d="M129 190 155 204 139 229 113 212Z" fill="#050708" stroke="#9d131d" strokeWidth="2" />
          <path d="M31 170 146 170 164 184 154 208 73 206 58 195 31 193Z" fill="#090b0e" stroke="#de1a25" strokeWidth="2" />
          <path d="M21 176 76 176 76 193 21 190Z" fill="#15191d" stroke="#ff2732" strokeWidth="2" />
          <path d="M83 206 123 206 111 245 91 245Z" fill="#080a0c" stroke="#8d1119" strokeWidth="2" />
          <path d="M64 179 145 179" stroke="#f51c27" strokeWidth="2" opacity=".78" />
          <circle cx="151" cy="186" r="6" fill="#f3202c" filter="url(#operativeGlow)" />
        </g>

        <g className="operative-forward-weapon">
          <path d="M177 164 207 178 198 226 153 243 137 218Z" fill="url(#operativeArmor)" stroke="#6e151b" strokeWidth="2" />
          <path d="M275 163 249 179 244 224 281 242 302 213Z" fill="url(#operativeArmor)" stroke="#6e151b" strokeWidth="2" />
          <path d="M181 191 237 175 272 204 253 251 184 252 159 216Z" fill="#090b0d" stroke="#a31821" strokeWidth="2" />
          <path d="M194 200 244 193 257 215 244 242 192 242 174 218Z" fill="#181c20" stroke="#591015" />
          <ellipse cx="218" cy="221" rx="38" ry="32" fill="#030405" stroke="#d21b25" strokeWidth="3" />
          <ellipse cx="218" cy="221" rx="28" ry="23" fill="#111419" stroke="#751017" strokeWidth="2" />
          <ellipse cx="218" cy="221" rx="17" ry="14" fill="#000" stroke="#f0232e" strokeWidth="2.5" />
          <ellipse cx="218" cy="221" rx="7" ry="6" fill="#120204" stroke="#ff4b55" />
          <path d="M186 210 166 201M250 210 275 197M188 236 169 248M248 237 268 252" stroke="#a9151e" strokeWidth="2" />
          <path d="M207 197 211 184 229 184 233 198" fill="#0c0f12" stroke="#a5151e" strokeWidth="2" />
        </g>

        <g className="operative-details" fill="none" stroke="url(#operativeEdge)">
          <path d="M288 180 317 193 311 275 285 286" strokeWidth="3" />
          <path d="M291 209 307 214M289 227 306 231M286 246 304 249" opacity=".7" />
          <path d="M205 344 250 344" strokeWidth="4" />
        </g>

        <g className="operative-muzzle" filter="url(#operativeGlow)">
          <path d="M22 183 -14 166 -4 181 -31 188 -3 194 -14 210Z" fill="#fff" />
          <path d="M22 183 -8 176 -24 188 -8 200Z" fill="#ff1724" />
        </g>
        <g className="operative-forward-muzzle" filter="url(#operativeGlow)">
          <circle cx="218" cy="221" r="42" fill="none" stroke="#fff" strokeWidth="3" />
          <circle cx="218" cy="221" r="27" fill="#fff" opacity=".94" />
          <path d="M218 152 225 195 218 204 211 195ZM218 290 211 247 218 238 225 247ZM149 221 192 214 201 221 192 228ZM287 221 244 228 235 221 244 214Z" fill="#ff1b27" />
          <path d="M170 173 203 202 204 214 192 211ZM266 269 233 240 232 228 244 231ZM266 173 237 206 225 207 228 195ZM170 269 199 236 211 235 208 247Z" fill="#fff" opacity=".82" />
        </g>
      </svg>
    </motion.div>
  );
}

function CrackImage({ visible, target }: { visible: boolean; target: ImpactTarget }) {
  return (
    <div
      className="cinematic-crack-image-anchor"
      style={{
        left: `${target.x * 100}%`,
        top: `${target.y * 100}%`,
        position: "absolute",
        width: "min(82.7vw, 827px)",
        aspectRatio: "667 / 1000",
        transform: "translate(-50%, -50%)",
        zIndex: 8,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="cinematic-crack-image"
        style={{
          width: "100%",
          height: "100%",
          background: 'url("/cracked-glass.png") center / contain no-repeat',
          mixBlendMode: "screen",
          filter: "drop-shadow(0 1px .8px rgba(0, 0, 0, .86)) drop-shadow(0 0 4px rgba(225, 238, 242, .16))",
          transformOrigin: "50% 50%",
        }}
        initial={{ opacity: 0, scale: .72, rotate: -1.5 }}
        animate={visible
          ? { opacity: [0, .96, .66], scale: [.72, 1.045, 1], rotate: [-1.5, .3, 0] }
          : { opacity: 0, scale: .72, rotate: -1.5 }}
        transition={{ duration: .48, times: [0, .36, 1], ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function GlassMorphImpact({ visible, target }: { visible: boolean; target: ImpactTarget }) {
  return (
    <motion.div
      className="glass-impact"
      style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
      initial={{ opacity: 0, scale: .76 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: .76 }}
      transition={{ duration: .52, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <span className="glass-pane glass-pane-a" />
      <span className="glass-pane glass-pane-b" />
      <span className="glass-pane glass-pane-c" />
      <span className="glass-pane glass-pane-d" />
      <span className="glass-pane glass-pane-e" />
      <span className="glass-pane glass-pane-f" />
      <i className="glass-impact-chip" />
    </motion.div>
  );
}

const codeRainGlyphs = Array.from("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモラリルレロワヲン<>[]{}:/\\#*+?");
type CodeStream = {
  column: number;
  head: number;
  intensity: number;
  length: number;
  speed: number;
};

function RedCodeRain({ active, dimmed }: { active: boolean; dimmed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvasContext = canvasElement.getContext("2d");
    if (!canvasContext) return;
    const activeCanvas: HTMLCanvasElement = canvasElement;
    const activeContext: CanvasRenderingContext2D = canvasContext;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let streams: CodeStream[] = [];
    let lastFrame = 0;
    const fontSize = 14;
    const columnGap = 16;

    function createStream(column: number, visibleRows: number): CodeStream {
      return {
        column,
        head: Math.random() * (visibleRows + 16) - 8,
        intensity: .72 + Math.random() * .28,
        length: 10 + Math.floor(Math.random() * 13),
        speed: .28 + Math.random() * .44,
      };
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio, 1);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      activeCanvas.width = Math.floor(width * pixelRatio);
      activeCanvas.height = Math.floor(height * pixelRatio);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const columnCount = Math.ceil(width / columnGap);
      const visibleRows = Math.ceil(height / fontSize);
      streams = [];
      for (let column = 0; column < columnCount; column += 1) {
        streams.push(createStream(column, visibleRows));
        if (Math.random() < .32) streams.push(createStream(column, visibleRows));
      }
      activeContext.fillStyle = "#000";
      activeContext.fillRect(0, 0, width, height);
    }

    function draw(timestamp = 0) {
      if (timestamp - lastFrame < 50) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      activeContext.fillStyle = "#000";
      activeContext.fillRect(0, 0, width, height);
      activeContext.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      activeContext.textBaseline = "top";

      for (const stream of streams) {
        const x = stream.column * columnGap + (columnGap - fontSize) / 2;
        const headRow = Math.floor(stream.head);

        for (let offset = 0; offset < stream.length; offset += 1) {
          const row = headRow - offset;
          const y = row * fontSize;
          if (row < 0 || y > height) continue;

          const trailStrength = Math.pow(1 - offset / stream.length, 1.55) * stream.intensity;
          const isHead = offset === 0;
          const hotHead = isHead && Math.random() > .7;
          const alpha = isHead ? .98 : Math.max(.065, trailStrength * .92);
          const glyph = codeRainGlyphs[Math.floor(Math.random() * codeRainGlyphs.length)];

          activeContext.shadowColor = isHead ? "#ff4f59" : "#f01220";
          activeContext.shadowBlur = isHead ? 5 : 0;
          activeContext.fillStyle = hotHead
            ? "rgba(255, 226, 228, .98)"
            : isHead
              ? "rgba(255, 65, 74, .98)"
              : `rgba(255, ${20 + Math.floor(Math.random() * 28)}, ${34 + Math.floor(Math.random() * 32)}, ${alpha})`;
          activeContext.fillText(glyph, x, y);
        }

        stream.head += stream.speed;
        if ((stream.head - stream.length) * fontSize > height) {
          stream.head = -Math.random() * 12;
          stream.intensity = .72 + Math.random() * .28;
          stream.length = 10 + Math.floor(Math.random() * 13);
          stream.speed = .28 + Math.random() * .44;
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [active]);

  return (
    <motion.div
      className="red-code-rain"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? dimmed ? .18 : 1 : 0 }}
      transition={{ duration: dimmed ? .55 : .8, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
      <span>RAXOS // SIGNAL RECONSTRUCTION</span>
    </motion.div>
  );
}

export function CinematicContact() {
  const [phase, setPhase] = useState<CinematicPhase>("idle");
  const [target, setTarget] = useState<ImpactTarget>({ x: .5, y: .42 });
  const [entryDuration, setEntryDuration] = useState(OPERATIVE_ENTRY_MIN_SECONDS);
  const reduceMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const active = phase !== "idle";
  const showCracks = phase === "cracked" || phase === "blackout";
  const showBlackout = phase === "blackout" || phase === "matrix" || phase === "modal";
  const showMatrix = phase === "matrix" || phase === "modal";

  useEffect(() => {
    const preloadTimer = window.setTimeout(() => {
      preloadOperativeAssets().catch(() => undefined);
    }, 900);
    return () => window.clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    const delays: Partial<Record<CinematicPhase, [number, CinematicPhase]>> = {
      aiming: [1100, "firing"],
      firing: [180, "cracked"],
      cracked: [850, "blackout"],
      blackout: [900, "matrix"],
      matrix: [5000, "modal"],
    };
    const next = delays[phase];
    if (!next) return;

    const timer = window.setTimeout(() => setPhase(next[1]), next[0]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (phase !== "entering" && phase !== "aiming") return;
    let frame = 0;

    function trackViewer(event: PointerEvent) {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setTarget({
          x: Math.min(.78, Math.max(.22, event.clientX / window.innerWidth)),
          y: Math.min(.68, Math.max(.18, event.clientY / window.innerHeight)),
        });
      });
    }

    window.addEventListener("pointermove", trackViewer, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", trackViewer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "firing") return;
    document.documentElement.dataset.cinematicImpact = "true";
    window.setTimeout(() => {
      delete document.documentElement.dataset.cinematicImpact;
    }, 520);
  }, [phase]);

  useEffect(() => {
    if (phase !== "modal") return;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [phase]);

  function startSequence() {
    setTarget({ x: .5, y: .42 });
    setEntryDuration(getOperativeEntryDuration(window.innerWidth));
    setPhase(reduceMotion ? "modal" : "entering");
  }

  function completeEntry() {
    setPhase((current) => current === "entering" ? "aiming" : current);
  }

  function closeSequence() {
    delete document.documentElement.dataset.cinematicImpact;
    setPhase("idle");
    window.setTimeout(() => launcherRef.current?.focus(), 30);
  }

  function handleModalKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSequence();
      return;
    }
    if (event.key !== "Tab" || !modalRef.current) return;

    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        className="cinematic-trigger"
        onClick={startSequence}
        disabled={active}
        aria-haspopup="dialog"
        aria-expanded={phase === "modal"}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="trigger-signal"><Radio size={13} aria-hidden="true" /> CHANNEL 07</span>
        <strong>INITIATE CONTACT</strong>
        <Crosshair size={18} aria-hidden="true" />
      </motion.button>

      <div className="cinematic-announcer" aria-live="polite" aria-atomic="true">
        {phaseCopy[phase]}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="cinematic-layer"
            data-phase={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="cinematic-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "modal" ? 0.84 : phase === "cracked" ? 0.34 : 0.12 }}
            />

            <div className="cinematic-hud" aria-hidden="true">
              <span>VISUAL FEED // LIVE</span>
              <b>{phaseCopy[phase]}</b>
              <i>SEQ 04—77</i>
            </div>

            <AnimatePresence>
              {phase === "entering" || phase === "aiming" || phase === "firing" || phase === "cracked"
                ? (
                    <PlaceholderOperative
                      entryDuration={entryDuration}
                      onArrival={completeEntry}
                      phase={phase}
                    />
                  )
                : null}
            </AnimatePresence>

            <motion.div
              className="targeting-reticle"
              style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
              initial={{ scale: .55, opacity: 0 }}
              animate={{
                scale: phase === "firing" ? 0.72 : 1,
                opacity: phase === "aiming" ? 1 : phase === "firing" ? .9 : 0,
              }}
              transition={{ duration: phase === "aiming" ? .32 : .1 }}
              aria-hidden="true"
            >
              <span className="reticle-ring reticle-ring-outer" />
              <span className="reticle-ring reticle-ring-inner" />
              <span className="reticle-brackets" />
              <i />
              <b>OCULAR LOCK // YOU</b>
            </motion.div>

            <GlassMorphImpact visible={showCracks} target={target} />
            <CrackImage visible={showCracks} target={target} />

            <motion.div
              className="cinematic-blackout"
              initial={{ opacity: 0 }}
              animate={{ opacity: showBlackout ? phase === "modal" ? .94 : 1 : 0 }}
              transition={{ duration: phase === "blackout" ? .9 : .5, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden="true"
            />
            <RedCodeRain active={showMatrix && !reduceMotion} dimmed={phase === "modal"} />

            {phase !== "modal" ? (
              <button className="cinematic-skip" type="button" onClick={() => setPhase("modal")}>
                <FastForward size={14} aria-hidden="true" /> SKIP SEQUENCE
              </button>
            ) : null}

            <AnimatePresence>
              {phase === "modal" ? (
                <div className="cinematic-modal-positioner">
                  <motion.section
                    ref={modalRef}
                    className="cinematic-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cinematic-modal-title"
                    onKeyDown={handleModalKeyDown}
                  initial={{ opacity: 0, scale: 0.92, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="cinematic-modal-frame" aria-hidden="true" />
                    <header className="cinematic-modal-header">
                      <div>
                        <small>BREACH PROTOCOL // CONTACT</small>
                        <h2 id="cinematic-modal-title">SECURE CHANNEL OPEN</h2>
                      </div>
                      <button ref={closeRef} type="button" onClick={closeSequence} aria-label="Close contact form">
                        <X size={20} aria-hidden="true" />
                      </button>
                    </header>
                    <EnquiryForm variant="modal" />
                  </motion.section>
                </div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
