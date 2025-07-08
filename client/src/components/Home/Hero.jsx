import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import CanvasLoader from "../canvas/Loader";

// === Styles ===
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",
  heroHeadText:
    "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",
};

// === 3D Model Component ===
const Computers = () => {
  const computer = useGLTF("/desktop_pc/scene.gltf");

  return (
    <mesh>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={0.8} position={[5, 5, 5]} />
      <primitive
        object={computer.scene}
        scale={0.75}
        position={[0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

// === Canvas Wrapper ===
const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  if (isMobile) return null; // ❌ Skip rendering on mobile

  return (
    <Canvas
      frameloop="demand"
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, powerPreference: "low-power", antialias: false }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Computers />
      </Suspense>
    </Canvas>
  );
};

// === Hero Section ===
const Hero = () => {
  return (
    <section
      className={`relative w-full h-100 sm:h-screen mx-auto bg-[url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1751888504/herobg_x5fme4.png')] bg-cover bg-center bg-no-repeat overflow-visible`}
    >
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Youcef</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Full-stack developer building clean, interactive web applications.
          </p>
        </div>
      </div>

      {/* === 3D Canvas (hidden on mobile) === */}
      <ComputersCanvas />

     
    </section>
  );
};

export default Hero;
