import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let landscapeGeom: THREE.PlaneGeometry | null = null;
    let landscapeMat: THREE.MeshStandardMaterial | null = null;
    let wireframeMat: THREE.MeshBasicMaterial | null = null;
    let routeGeom: THREE.TubeGeometry | null = null;
    let routeMat: THREE.MeshBasicMaterial | null = null;
    let goatTexture: THREE.CanvasTexture | null = null;
    let goatPlaneGeom: THREE.PlaneGeometry | null = null;
    let goatMat: THREE.MeshBasicMaterial | null = null;
    let snowGeom: THREE.BufferGeometry | null = null;
    let snowTexture: THREE.CanvasTexture | null = null;
    let snowMat: THREE.PointsMaterial | null = null;
    let cloudGeom: THREE.SphereGeometry | null = null;

    // Scroll & Mouse state variables defined outside try block for event listeners reference
    let handleScroll: (() => void) | null = null;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleResize: (() => void) | null = null;

    try {
      // 1. Scene setup
      const scene = new THREE.Scene();
      
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      // Luxury bright warm cream alpine atmosphere matching body background
      scene.fog = new THREE.FogExp2(0xfaf6ee, isMobile ? 0.02 : 0.015);

      // 2. Camera setup
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 18, 45);
      camera.lookAt(0, 5, 0);

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = false; // Disable heavy shadow mapping completely
      container.appendChild(renderer.domElement);

      // 4. Lighting systems
      const ambientLight = new THREE.AmbientLight(0xfaf6ee, isMobile ? 2.0 : 1.8);
      scene.add(ambientLight);

      // Soft warm sun light (Shadow maps disabled for 60 FPS fluid rendering)
      const sunLight = new THREE.DirectionalLight(0xf5ebe0, isMobile ? 1.0 : 1.5);
      sunLight.position.set(30, 50, -10);
      sunLight.castShadow = false;
      scene.add(sunLight);

      // Subtle Burgundy glowing fill light
      const valleyLight = new THREE.PointLight(0x7c1c1c, isMobile ? 1.0 : 1.5, 100);
      valleyLight.position.set(0, 2, 5);
      scene.add(valleyLight);

      const goldPeakLight = new THREE.PointLight(0xc5a059, isMobile ? 0.8 : 1.2, 80);
      goldPeakLight.position.set(-20, 15, -20);
      scene.add(goldPeakLight);

      // 5. Procedural 3D Mountain Valley
      // We construct a massive mesh landscape using PlaneGeometry and displacing its heights
      // Optimized segment counts for raw performance and high FPS
      const landscapeSize = 250;
      const landscapeSegments = isMobile ? 12 : 32;
      landscapeGeom = new THREE.PlaneGeometry(landscapeSize, landscapeSize, landscapeSegments, landscapeSegments);
      
      // Rotate plane to be horizontal
      landscapeGeom.rotateX(-Math.PI / 2);

      // Adjust vertices to form a central glacial mountain valley pass
      const posAttribute = landscapeGeom.attributes.position;
      for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const z = posAttribute.getZ(i); // Since rotated, Y coordinate of plane corresponds to 3D Z

        // Create a valley in the center (around x = 0)
        const distanceFromCenter = Math.abs(x);
        
        // Peaks layout
        let yHeight = 0;

        if (distanceFromCenter > 15) {
          // High mountain peaks on side rails
          const peakIntensity = (distanceFromCenter - 15) * 0.45;
          // Layered sine wave noises representing jagged mountain ridges
          yHeight = peakIntensity + Math.sin(x * 0.15) * Math.cos(z * 0.15) * 6;
          yHeight += Math.sin(x * 0.05) * Math.sin(z * 0.08) * 12;
          yHeight += Math.cos(x * 0.3) * Math.sin(z * 0.3) * 1.5;
        } else {
          // Flat gravel path of the valley floor
          yHeight = Math.sin(x * 0.1) * 1.5 + Math.cos(z * 0.05) * 0.8;
        }

        // Add a ridge in the distance to close the horizon
        const forwardDistance = z;
        if (forwardDistance < -40) {
          yHeight += (Math.abs(forwardDistance) - 40) * 0.35 + Math.cos(x * 0.1) * 4;
        }

        posAttribute.setY(i, yHeight); // Set the vertical axis Y
      }
      
      landscapeGeom.computeVertexNormals();

      // Bright warm cream-rock landscape material
      landscapeMat = new THREE.MeshStandardMaterial({
        color: 0xf3eee5,
        roughness: 0.90,
        metalness: 0.0,
        flatShading: true, // Gives gorgeous vintage faceted look
      });

      const landscapeMesh = new THREE.Mesh(landscapeGeom, landscapeMat);
      landscapeMesh.receiveShadow = true;
      landscapeMesh.castShadow = true;
      scene.add(landscapeMesh);

      // Warm-burgundy/gold Grid wireframe (Only enabled on desktop for peak performance)
      if (!isMobile) {
        wireframeMat = new THREE.MeshBasicMaterial({
          color: 0x7c1c1c,
          wireframe: true,
          transparent: true,
          opacity: 0.04,
        });
        const wireframeMesh = new THREE.Mesh(landscapeGeom, wireframeMat);
        wireframeMesh.position.y = 0.05; // Slightly offset to prevent z-fighting
        scene.add(wireframeMesh);
      }

      // 6. Glowing Burgundy Route Path winding down the valley
      const curvePoints = [
        new THREE.Vector3(0, 0.8, -100),
        new THREE.Vector3(-4, 0.9, -60),
        new THREE.Vector3(3, 1.1, -25),
        new THREE.Vector3(-2, 1.3, 10),
        new THREE.Vector3(5, 1.5, 40),
      ];
      const routeCurve = new THREE.CatmullRomCurve3(curvePoints);
      routeGeom = new THREE.TubeGeometry(routeCurve, 64, 0.25, 8, false);
      routeMat = new THREE.MeshBasicMaterial({
        color: 0x7c1c1c, // Crimson Red pulse
        transparent: true,
        opacity: 0.35
      });
      const routeMesh = new THREE.Mesh(routeGeom, routeMat);
      scene.add(routeMesh);

      // 7. Alpine Goat Silhouette on a Prominent Ridge
      // We place a flat plane with a rendered vector-accurate goat outline silhouetted against the dark sky
      // Using a canvas texture to dynamically draw a secure beautifully styled goat so it is perfectly crisp
      const goatCanvas = document.createElement('canvas');
      goatCanvas.width = 256;
      goatCanvas.height = 256;
      const gCtx = goatCanvas.getContext('2d');
      if (gCtx) {
        gCtx.clearRect(0, 0, 256, 256);
        gCtx.fillStyle = '#232329'; // Charcoal silhouette matches our header styling

        // Draw stylized goat standing proud
        gCtx.beginPath();
        // Body
        gCtx.ellipse(130, 140, 45, 25, 0, 0, Math.PI * 2);
        gCtx.fill();

        // Strong visual legs
        gCtx.fillRect(100, 140, 8, 48); // Leg 1
        gCtx.fillRect(115, 140, 7, 45); // Leg 2
        gCtx.fillRect(145, 140, 8, 48); // Leg 3
        gCtx.fillRect(158, 140, 7, 45); // Leg 4

        // Neck and head rising high
        gCtx.beginPath();
        gCtx.ellipse(165, 110, 12, 28, -Math.PI / 5, 0, Math.PI * 2);
        gCtx.ellipse(175, 90, 8, 18, Math.PI / 4, 0, Math.PI * 2);
        gCtx.fill();

        // Curved Horns (Antique gold colored style or solid dark)
        gCtx.fillStyle = '#c5a059'; // Gilded accent horns!
        gCtx.beginPath();
        gCtx.arc(165, 82, 20, Math.PI, Math.PI * 1.5);
        gCtx.lineWidth = 5;
        gCtx.strokeStyle = '#c5a059';
        gCtx.stroke();

        gCtx.beginPath();
        gCtx.arc(160, 82, 17, Math.PI, Math.PI * 1.55);
        gCtx.stroke();
      }

      goatTexture = new THREE.CanvasTexture(goatCanvas);
      goatPlaneGeom = new THREE.PlaneGeometry(10, 10);
      goatMat = new THREE.MeshBasicMaterial({
        map: goatTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const goatMesh = new THREE.Mesh(goatPlaneGeom, goatMat);
      // Position on a high prominent left-leaning ridge close to camera
      goatMesh.position.set(-18, 17.5, 8);
      goatMesh.rotation.y = Math.PI / 5;
      scene.add(goatMesh);

      // 8. Snow Weather Particles System (Optimized counts for seamless scrolling)
      const snowCount = isMobile ? 30 : 120;
      snowGeom = new THREE.BufferGeometry();
      const snowPos = new Float32Array(snowCount * 3);
      const snowSpeeds: number[] = [];

      for (let i = 0; i < snowCount; i++) {
        // Scatter points within our camera bounds
        snowPos[i * 3] = (Math.random() - 0.5) * 80;     // X
        snowPos[i * 3 + 1] = Math.random() * 45;         // Y
        snowPos[i * 3 + 2] = (Math.random() - 0.5) * 80; // Z
        snowSpeeds.push(Math.random() * 0.08 + 0.03);    // Falling speed
      }

      snowGeom.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

      // Circle texture for soft organic aesthetic gold dust grains
      const snowCanvas = document.createElement('canvas');
      snowCanvas.width = 16;
      snowCanvas.height = 16;
      const sCtx = snowCanvas.getContext('2d');
      if (sCtx) {
        const grad = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(197, 160, 89, 0.75)'); // Gilded amber pollen
        grad.addColorStop(1, 'rgba(197, 160, 89, 0)');
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 16, 16);
      }
      snowTexture = new THREE.CanvasTexture(snowCanvas);

      snowMat = new THREE.PointsMaterial({
        size: 0.75,
        map: snowTexture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.NormalBlending
      });

      const snowParticles = new THREE.Points(snowGeom, snowMat);
      scene.add(snowParticles);

      // 9. Floating Clouds / Mist System
      const cloudCount = 12;
      const cloudsArray: THREE.Mesh[] = [];
      cloudGeom = new THREE.SphereGeometry(6, 6, 6);

      for (let i = 0; i < cloudCount; i++) {
        const cloudMat = new THREE.MeshBasicMaterial({
          color: 0x7c1c1c, // Cloud is tinted on bottom with burgundy glow
          transparent: true,
          opacity: 0.05,
        });
        const cloud = new THREE.Mesh(cloudGeom, cloudMat);
        cloud.scale.set(3, 0.45, 1);
        cloud.position.set(
          (Math.random() - 0.5) * 120,
          Math.random() * 12 + 6,
          -10 - Math.random() * 60
        );
        scene.add(cloud);
        cloudsArray.push(cloud);
      }

      // 10. Scroll & Mouse Handlers for Interactivity
      let scrollY = window.scrollY;
      let targetScrollY = window.scrollY;

      handleScroll = () => {
        targetScrollY = window.scrollY;
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      let mouseX = 0;
      let mouseY = 0;
      handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Handle viewport resize
      handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (renderer) renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // 11. Animation ticking loop
      let clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Smooth scroll interpolation
        scrollY += (targetScrollY - scrollY) * 0.08;

        // VISIBILITY CULLING: Only process animations and render if visible on screen (< 1200px scroll)
        // This stops WebGL processing completely when the user is viewing the packages, fleet, safety, contact or FAQ sections,
        // instantly giving them 60 FPS buttery-smooth scrolling.
        if (scrollY < 1200) {
          const scrollRatio = Math.min(scrollY / 1800, 1);
          
          // Camera paths
          camera.position.z = 45 - (scrollRatio * 32); // Closer into the mountain
          camera.position.y = 18 - (scrollRatio * 11); // Flying closer to the route line
          camera.position.x += (mouseX * 4 - camera.position.x + (scrollRatio * 8)) * 0.05; // Mouse hover slide + curve track

          // Point valley light moves with travel scroll
          valleyLight.position.z = 5 - (scrollRatio * 50);
          goldPeakLight.position.y = 15 + Math.sin(elapsedTime * 0.5) * 2;

          // Pulse the routing line with burgundy glow intensity
          const pulse = 0.7 + Math.sin(elapsedTime * 2.5) * 0.3;
          if (routeMat) {
            routeMat.color.setHex(0x7c1c1c).multiplyScalar(pulse);
          }

          // Animate weather snow particles
          if (snowGeom && snowGeom.attributes.position) {
            const positions = snowGeom.attributes.position.array as Float32Array;
            for (let i = 0; i < snowCount; i++) {
              // Fall down
              positions[i * 3 + 1] -= snowSpeeds[i];
              // Swerve slightly
              positions[i * 3] += Math.sin(elapsedTime + i) * 0.008;

              // Reset if too low or out of sight
              if (positions[i * 3 + 1] < -2) {
                positions[i * 3 + 1] = 45 + Math.random() * 5;
                positions[i * 3] = (Math.random() - 0.5) * 80;
              }
            }
            snowGeom.attributes.position.needsUpdate = true;
          }

          // Rotate and float clouds
          cloudsArray.forEach((c, idx) => {
            c.position.x += 0.02 * (idx % 2 === 0 ? 1 : -1);
            if (c.position.x > 70) c.position.x = -70;
            if (c.position.x < -70) c.position.x = 70;
            c.position.y += Math.sin(elapsedTime * 0.3 + idx) * 0.003;
          });

          // Render scene
          if (renderer) renderer.render(scene, camera);
        }

        animId = requestAnimationFrame(tick);
      };

      tick();

    } catch (e) {
      console.warn("WebGL not supported or failed to initialize, falling back to static gradient:", e);
      setHasError(true);
    }

    // 12. Cleanup
    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
      if (handleScroll) window.removeEventListener('scroll', handleScroll);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // dispose geometries/materials
      if (landscapeGeom) landscapeGeom.dispose();
      if (landscapeMat) landscapeMat.dispose();
      if (wireframeMat) wireframeMat.dispose();
      if (routeGeom) routeGeom.dispose();
      if (routeMat) routeMat.dispose();
      if (goatTexture) goatTexture.dispose();
      if (goatPlaneGeom) goatPlaneGeom.dispose();
      if (goatMat) goatMat.dispose();
      if (snowGeom) snowGeom.dispose();
      if (snowTexture) snowTexture.dispose();
      if (snowMat) snowMat.dispose();
      if (cloudGeom) cloudGeom.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 -z-30 w-full h-full bg-gradient-to-b from-alpine-cream-light via-[#f7f2e8] to-[#faf6ee]" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-30 w-full h-full overflow-hidden pointer-events-none"
    />
  );
}
