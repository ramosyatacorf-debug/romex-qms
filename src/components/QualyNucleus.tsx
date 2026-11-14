"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  ox: number;
  oy: number;
  oz: number;
  pulse: number;
}

interface QualyNucleusProps {
  speaking?: boolean;
  listening?: boolean;
  thinking?: boolean;
  size?: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Núcleo 3D estilo ELYRA, contraste alto para fondo claro RomEx */
export default function QualyNucleus({
  speaking = false,
  listening = false,
  thinking = false,
  size = 320,
}: QualyNucleusProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point3D[]>([]);
  const rafRef = useRef(0);
  const rotRef = useRef({ x: 0.22, y: 0 });
  const timeRef = useRef(0);
  const stateRef = useRef({ speaking, listening, thinking });
  const smoothRef = useRef({ activity: 0, listenGlow: 0, thinkPulse: 0, coreBoost: 0 });

  stateRef.current = { speaking, listening, thinking };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const points: Point3D[] = [];
    const count = 200;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      points.push({
        ox: Math.cos(theta) * radius,
        oy: y,
        oz: Math.sin(theta) * radius,
        pulse: (i * 0.37) % (Math.PI * 2),
      });
    }
    pointsRef.current = points;

    // Azul más saturado para que se note en fondo claro
    const C = {
      core: "37, 99, 235",
      mid: "59, 130, 246",
      soft: "96, 165, 250",
      center: "255, 255, 255",
      think: "124, 58, 237",
    };

    const project = (p: Point3D, rotY: number, rotX: number) => {
      const x = p.ox * Math.cos(rotY) - p.oz * Math.sin(rotY);
      const z = p.ox * Math.sin(rotY) + p.oz * Math.cos(rotY);
      const y = p.oy;
      const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      const scale = size * 0.36;
      const perspective = 700 / (700 + z2 * scale);
      return {
        sx: size / 2 + x * scale * perspective,
        sy: size / 2 + y2 * scale * perspective * 0.94,
        depth: z2,
        scale: perspective,
      };
    };

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const { speaking: sp, listening: li, thinking: th } = stateRef.current;

      const targetActivity = sp || li || th ? 1 : 0;
      const targetListen = li ? 1 : 0;
      const targetThink = th ? 1 : 0;
      const targetSpeak = sp ? 1 : 0;

      const sm = smoothRef.current;
      sm.activity = lerp(sm.activity, targetActivity, 0.06);
      sm.listenGlow = lerp(sm.listenGlow, targetListen, 0.08);
      sm.thinkPulse = lerp(sm.thinkPulse, targetThink, 0.07);
      sm.coreBoost = lerp(
        sm.coreBoost,
        targetSpeak * 0.75 + targetListen * 0.5 + targetThink * 0.6,
        0.07
      );

      const act = sm.activity;
      const listen = sm.listenGlow;
      const think = sm.thinkPulse;

      // Siempre rota un poco más para que se note vivo en idle
      rotRef.current.y += 0.004 + act * 0.01 + think * 0.005;
      rotRef.current.x = 0.2 + Math.sin(t * 0.35) * 0.03 + listen * 0.02;

      ctx.clearRect(0, 0, size, size);

      const coreRgb = think > 0.3 ? C.think : C.core;
      const midRgb = think > 0.3 ? "139, 92, 246" : C.mid;

      // Atmósfera más fuerte (fondo claro)
      const atmosA = 0.18 + act * 0.22 + listen * 0.14 + think * 0.12;
      const outer = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.02,
        size / 2,
        size / 2,
        size * 0.48
      );
      outer.addColorStop(0, `rgba(${midRgb}, ${Math.min(0.55, atmosA * 0.9)})`);
      outer.addColorStop(0.3, `rgba(${coreRgb}, ${Math.min(0.35, atmosA * 0.55)})`);
      outer.addColorStop(0.6, `rgba(${coreRgb}, ${atmosA * 0.18})`);
      outer.addColorStop(1, "transparent");
      ctx.fillStyle = outer;
      ctx.fillRect(0, 0, size, size);

      if (listen > 0.02) {
        const haloR = size * (0.38 + Math.sin(t * 1.8) * 0.015);
        const halo = ctx.createRadialGradient(
          size / 2,
          size / 2,
          haloR * 0.65,
          size / 2,
          size / 2,
          haloR * 1.15
        );
        halo.addColorStop(0, "transparent");
        halo.addColorStop(0.65, `rgba(${C.core}, ${0.2 * listen})`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, haloR * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      const projected = pointsRef.current.map((p) =>
        project(p, rotRef.current.y, rotRef.current.x)
      );
      projected.sort((a, b) => a.depth - b.depth);

      // Anillos más visibles
      for (let r = 0; r < 3; r++) {
        const ringR =
          size * (0.27 + r * 0.055) + Math.sin(t * 1.0 + r * 0.9) * (2 + act * 4);
        ctx.beginPath();
        ctx.ellipse(
          size / 2,
          size / 2,
          ringR,
          ringR * (0.17 + r * 0.02),
          Math.sin(t * 0.28 + r * 0.6) * (0.4 + act * 0.12),
          0,
          Math.PI * 2
        );
        const ringA = 0.22 - r * 0.04 + act * 0.18;
        ctx.strokeStyle = `rgba(${coreRgb}, ${Math.min(0.65, ringA)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Enlaces
      const maxDist = 0.38 + act * 0.12;
      const n = pointsRef.current.length;
      const maxLinks = act > 0.4 ? 4 : 3;
      for (let i = 0; i < n; i++) {
        let links = 0;
        for (let j = i + 1; j < n && links < maxLinks; j++) {
          const a = pointsRef.current[i];
          const b = pointsRef.current[j];
          const dx = a.ox - b.ox;
          const dy = a.oy - b.oy;
          const dz = a.oz - b.oz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < maxDist && dist > 0.08) {
            const pa = projected[i];
            const pb = projected[j];
            if (pa.depth > -0.5 && pb.depth > -0.5) {
              const alpha = (0.14 + act * 0.22) * (1 - dist / maxDist);
              ctx.beginPath();
              ctx.moveTo(pa.sx, pa.sy);
              ctx.lineTo(pb.sx, pb.sy);
              ctx.strokeStyle = `rgba(${coreRgb}, ${Math.min(0.55, alpha)})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
              links++;
            }
          }
        }
      }

      // Puntos más opacos y grandes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const base = pointsRef.current[i];
        const pulse =
          0.75 + 0.25 * Math.sin(t * (thinking ? 3.2 : 1.8) + base.pulse);
        const depthFactor = Math.max(0.2, (p.depth + 1) / 2);
        const r = (1.35 + act * 0.75) * p.scale * pulse;

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        const alpha = 0.35 + depthFactor * 0.55;
        ctx.fillStyle = `rgba(${think > 0.3 ? C.think : C.mid}, ${Math.min(0.95, alpha)})`;
        ctx.fill();
      }

      // Núcleo central fuerte
      const coreR =
        16 + sm.coreBoost * 10 + Math.sin(t * (th ? 3.5 : 2.2)) * (1.5 + act * 2);
      const core = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        coreR * 2.6
      );
      core.addColorStop(0, `rgba(${C.center}, 1)`);
      core.addColorStop(0.12, `rgba(${think > 0.3 ? C.think : C.soft}, 0.95)`);
      core.addColorStop(0.32, `rgba(${coreRgb}, ${0.55 + act * 0.2})`);
      core.addColorStop(0.55, `rgba(${coreRgb}, ${0.28 + act * 0.12})`);
      core.addColorStop(0.8, `rgba(${coreRgb}, 0.1)`);
      core.addColorStop(1, "transparent");

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, coreR * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Anillo de pulso
      const pulseR = coreR * 1.7 + Math.sin(t * 2.8) * (4 + act * 3);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${midRgb}, ${0.22 + act * 0.25})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <canvas ref={canvasRef} className="block relative z-10" />
    </div>
  );
}
