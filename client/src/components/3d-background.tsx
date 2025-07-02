import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Add floating shapes
    const shapes: THREE.Mesh[] = [];
    const geometry = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16),
      new THREE.OctahedronGeometry(1, 0)
    ];

    const material = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      emissive: 0x0c4a6e,
      shininess: 100,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });

    // Create multiple floating shapes
    for (let i = 0; i < 5; i++) {
      const shape = new THREE.Mesh(
        geometry[Math.floor(Math.random() * geometry.length)],
        material.clone()
      );
      
      // Random position and rotation
      shape.position.x = Math.random() * 20 - 10;
      shape.position.y = Math.random() * 20 - 10;
      shape.position.z = Math.random() * 10 - 5;
      
      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      
      // Random scale
      const scale = 0.5 + Math.random() * 1.5;
      shape.scale.set(scale, scale, scale);
      
      shapes.push(shape);
      scene.add(shape);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate shapes
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.001 * (i + 1);
        shape.rotation.y += 0.002 * (i + 1);
        
        // Float up and down
        shape.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
      });
      
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-20" />;
};

export { ThreeDBackground };
export default ThreeDBackground;
