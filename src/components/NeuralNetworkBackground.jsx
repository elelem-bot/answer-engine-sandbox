import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralNetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Nodes
    const NODE_COUNT = 100;
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.4, 8, 8);

    for (let i = 0; i < NODE_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x2DC6FE : 0x81FBEF,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.3,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 60
      );
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        vz: (Math.random() - 0.5) * 0.02,
        pulse: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      nodes.push(mesh);
    }

    // Edges (LineSegments — much more performant than individual Lines)
    const MAX_DIST = 32;
    let edgesMesh = null;

    const rebuildEdges = () => {
      if (edgesMesh) {
        scene.remove(edgesMesh);
        edgesMesh.geometry.dispose();
        edgesMesh.material.dispose();
      }
      const positions = [];
      const colors = [];
      const c1 = new THREE.Color(0x2DC6FE);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = nodes[i].position.distanceTo(nodes[j].position);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.4;
            positions.push(...nodes[i].position.toArray(), ...nodes[j].position.toArray());
            colors.push(c1.r, c1.g, c1.b, c1.r, c1.g, c1.b);
          }
        }
      }
      if (positions.length === 0) return;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ color: 0x2DC6FE, transparent: true, opacity: 0.25 });
      edgesMesh = new THREE.LineSegments(geo, mat);
      scene.add(edgesMesh);
    };

    rebuildEdges();

    const clock = new THREE.Clock();
    let frameCount = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      frameCount++;

      nodes.forEach(node => {
        node.position.x += node.userData.vx;
        node.position.y += node.userData.vy;
        node.position.z += node.userData.vz;
        if (Math.abs(node.position.x) > 92) node.userData.vx *= -1;
        if (Math.abs(node.position.y) > 52) node.userData.vy *= -1;
        if (Math.abs(node.position.z) > 32) node.userData.vz *= -1;
        node.material.opacity = 0.25 + 0.45 * Math.abs(Math.sin(t * 0.7 + node.userData.pulse));
      });

      if (frameCount % 4 === 0) rebuildEdges();

      camera.position.x = Math.sin(t * 0.04) * 6;
      camera.position.y = Math.cos(t * 0.03) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (edgesMesh) { edgesMesh.geometry.dispose(); edgesMesh.material.dispose(); }
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}