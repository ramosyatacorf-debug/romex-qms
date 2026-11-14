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

/** Núcleo 3D interactivo inspirado en ELYRA — canvas puro, sin dependencias extra */
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
    const count = 160;
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

    // Paleta Qualy (azul laboratorio)
    const C = {
      core: "59, 130, 246",
      mid: "96, 165, 250",
      soft: "147, 197, 253",
      center: "239, 246, 255",
      think: "167, 139, 250",
    };

    const project = (p: Point3D, rotY: number, rotX: number) => {
      const x = p.ox * Math.cos(rotY) - p.oz * Math.sin(rotY);
      const z = p.ox * Math.sin(rotY) + p.oz * Math.cos(rotY);
      const y = p.oy;
      const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      const scale = size * 0.34;
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
        targetSpeak * 0.7 + targetListen * 0.45 + targetThink * 0.55,
        0.07
      );

      const act = sm.activity;
      const listen = sm.listenGlow;
      const think = sm.thinkPulse;

      rotRef.current.y += 0.0026 + act * 0.008 + think * 0.004;
      rotRef.current.x = 0.2 + Math.sin(t * 0.3) * 0.022 + listen * 0.018;

      ctx.clearRect(0, 0, size, size);

      const coreRgb = think > 0.3 ? C.think : C.core;
      const midRgb = think > 0.3 ? "139, 92, 246" : C.mid;

      // Atmósfera
      const atmosA = 0.06 + act * 0.14 + listen * 0.1 + think * 0.08;
      const outer = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.04,
        size / 2,
        size / 2,
        size * 0.5
      );
      outer.addColorStop(0, `rgba(${midRgb}, ${atmosA * 0.75})`);
      outer.addColorStop(0.25, `rgba(${coreRgb}, ${atmosA * 0.45})`);
      outer.addColorStop(0.55, `rgba(${coreRgb}, ${atmosA * 0.14})`);
      outer.addColorStop(1, "transparent");
      ctx.fillStyle = outer;
      ctx.fillRect(0, 0, size, size);

      if (listen > 0.02) {
        const haloR = size * (0.36 + Math.sin(t * 1.8) * 0.012);
        const halo = ctx.createRadialGradient(
          size / 2,
          size / 2,
          haloR * 0.7,
          size / 2,
          size / 2,
          haloR * 1.12
        );
        halo.addColorStop(0, "transparent");
        halo.addColorStop(0.7, `rgba(${C.core}, ${0.07 * listen})`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, haloR * 1.12, 0, Math.PI * 2);
        ctx.fill();
      }

      const projected = pointsRef.current.map((p) =>
        project(p, rotRef.current.y, rotRef.current.x)
      );
      projected.sort((a, b) => a.depth - b.depth);

      // Anillos orbitales
      for (let r = 0; r < 3; r++) {
        const ringR =
          size * (0.26 + r * 0.055) + Math.sin(t * 1.0 + r * 0.9) * (1.5 + act * 3);
        ctx.beginPath();
        ctx.ellipse(
          size / 2,
          size / 2,
          ringR,
          ringR * (0.16 + r * 0.02),
          Math.sin(t * 0.28 + r * 0.6) * (0.4 + act * 0.12),
          0,
          Math.PI * 2
        );
        const ringA = 0.07 - r * 0.015 + act * 0.09;
        ctx.strokeStyle = `rgba(${coreRgb}, ${Math.min(0.4, ringA)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Enlaces de red
      const maxDist = 0.36 + act * 0.1;
      const n = pointsRef.current.length;
      const maxLinks = act > 0.5 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        let links = 0;
        for (let j = i + 1; j < n && links < maxLinks; j++) {
          const a = pointsRef.current[i];
          const b = pointsRef.current[j];
          const dx = a.ox - b.ox;
          const dy = a.oy - b.oy;
          const dz = a.oz - b.oz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < maxDist && dist > 0.1) {
            const pa = projected[i];
            const pb = projected[j];
            if (pa.depth > -0.5 && pb.depth > -0.5) {
              const alpha = (0.06 + act * 0.16) * (1 - dist / maxDist);
              ctx.beginPath();
              ctx.moveTo(pa.sx, pa.sy);
              ctx.lineTo(pb.sx, pb.sy);
              ctx.strokeStyle = `rgba(${coreRgb}, ${Math.min(0.45, alpha)})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
              links++;
            }
          }
        }
      }

      // Puntos
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const base = pointsRef.current[i];
        const pulse =
          0.75 + 0.25 * Math.sin(t * (thinking ? 3.2 : 1.8) + base.pulse);
        const depthFactor = Math.max(0.15, (p.depth + 1) / 2);
        const r = (1.15 + act * 0.65) * p.scale * pulse;

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${think > 0.3 ? C.think : C.soft}, ${0.2 + depthFactor * 0.55})`;
        ctx.fill();
      }

      // Núcleo central
      const coreR =
        14 + sm.coreBoost * 8 + Math.sin(t * (th ? 3.5 : 2.2)) * (1 + act * 1.8);
      const core = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        coreR * 2.8
      );
      core.addColorStop(0, `rgba(${C.center}, 0.9)`);
      core.addColorStop(0.15, `rgba(${think > 0.3 ? C.think : C.soft}, 0.55)`);
      core.addColorStop(0.4, `rgba(${coreRgb}, ${0.28 + act * 0.18})`);
      core.addColorStop(0.7, `rgba(${coreRgb}, ${0.08 + act * 0.06})`);
      core.addColorStop(1, "transparent");

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, coreR * 2.8, 0, Math.PI * 2);
      ctx.fill();

      if (act > 0.1) {
        const pulseR = coreR * 1.6 + Math.sin(t * 3) * (3 + act * 2);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${midRgb}, ${(0.14 + act * 0.12) * act})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

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
            "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 65%)",
          filter: "blur(28px)",
        }}
      />
      <canvas ref={canvasRef} className="block relative z-10" />
    </div>
  );
}
