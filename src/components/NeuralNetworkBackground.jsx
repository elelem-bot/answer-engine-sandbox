import { useEffect, useRef } from "react";

export default function NeuralNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 90;
    const MAX_DIST = 160;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? "#2DC6FE" : "#81FBEF",
    }));

    let animId;
    let t = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.012;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(45,198,254,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const opacity = 0.3 + 0.55 * Math.abs(Math.sin(t * 0.9 + n.pulse));
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + Math.round(opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Soft glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        grd.addColorStop(0, n.color + "33");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}