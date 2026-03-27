import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralNetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Nodes
    const NODE_COUNT = 120;
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.35, 8, 8);

    for (let i = 0; i < NODE_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x2DC6FE : 0x81FBEF,
        transparent: true,
        opacity: Math.random() * 0.6 + 0.3,
      });
      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 60
      );
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vz: (Math.random() - 0.5) * 0.02,
        pulseOffset: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      nodes.push(mesh);
    }

    // Edges
    const MAX_DISTANCE = 30;
    const edgeLines = [];

    const buildEdges = () => {
      edgeLines.forEach(l => scene.remove(l));
      edgeLines.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < MAX_DISTANCE) {
            const opacity = (1 - dist / MAX_DISTANCE) * 0.35;
            const geo = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position.clone(),
              nodes[j].position.clone(),
            ]);
            const mat = new THREE.LineBasicMaterial({
              color: 0x2DC6FE,
              transparent: true,
              opacity,
            });
            const line = new THREE.Line(geo, mat);
            scene.add(line);
            edgeLines.push(line);
          }
        }
      }
    };

    buildEdges();

    let edgeTimer = 0;
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Move nodes
      nodes.forEach((node) => {
        node.position.x += node.userData.vx;
        node.position.y += node.userData.vy;
        node.position.z += node.userData.vz;

        // Bounce
        if (Math.abs(node.position.x) > 82) node.userData.vx *= -1;
        if (Math.abs(node.position.y) > 47) node.userData.vy *= -1;
        if (Math.abs(node.position.z) > 32) node.userData.vz *= -1;

        // Pulse opacity
        node.material.opacity = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.8 + node.userData.pulseOffset));
      });

      // Rebuild edges every 3 frames
      edgeTimer++;
      if (edgeTimer % 3 === 0) buildEdges();

      // Slow camera drift
      camera.position.x = Math.sin(t * 0.05) * 8;
      camera.position.y = Math.cos(t * 0.04) * 4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}