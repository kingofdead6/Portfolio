/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, Component, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
  Html,
} from "@react-three/drei";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../api';

const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",
  sectionHeadText:
    "text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]",
  sectionSubText:
    "sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider",
};

// Animation utilities
const textVariant = (delay) => ({
  hidden: {
    y: -50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay: delay,
    },
  },
});

const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});

const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren,
      delayChildren: delayChildren || 0,
    },
  },
});

// Error Boundary
class CanvasErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-[#aaa6c3] text-center">
          Failed to load 3D content. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// Three.js-compatible CanvasLoader
const CanvasLoader = () => (
  <Html center>
    <div className="w-8 h-8 border-4 border-t-white border-gray-600 rounded-full animate-spin" />
  </Html>
);

// Placeholder SectionWrapper HOC
const SectionWrapper = (Component, idName) => {
  return (props) => (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="show"
      id={idName}
      className="relative w-full mx-auto"
    >
      <Component {...props} />
    </motion.section>
  );
};

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon, name }) => {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
        <Html center>
          <div className="text-[#aaa6c3] text-sm mt-2">{name}</div>
        </Html>
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

const Tech = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechStacks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/techstack`);
        const mainPageTechs = response.data.filter(tech => tech.showOnMainPage).map(tech => ({
          name: tech.name,
          icon: tech.picture || 'https://via.placeholder.com/150', // Fallback image
        }));
        setTechnologies(mainPageTechs);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch technologies');
        toast.error(err.response?.data?.message || 'Failed to fetch technologies', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTechStacks();
  }, []);

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      animate="show"
      className={`${styles.paddingX} ${styles.paddingY}`}
    >
      <ToastContainer />
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show">
          <motion.p variants={textVariant(0.2)} className={`${styles.sectionSubText} text-[#aaa6c3]`}>
            Technologies
          </motion.p>
          <motion.h2 variants={textVariant(0.3)} className={`${styles.sectionHeadText}`}>
            My Tech Stack.
          </motion.h2>
        </motion.div>

        <motion.p
          variants={fadeIn("up", "spring", 0.4, 1)}
          className="mt-4 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px]"
        >
          I leverage a powerful set of <span className="font-semibold">modern technologies</span> to build robust, scalable, and engaging web applications. From <span className="font-semibold">front-end frameworks</span> to <span className="font-semibold">back-end solutions</span>, my tech stack is designed to deliver <span className="font-semibold">high-performance</span> and <span className="font-semibold">user-friendly</span> digital experiences. Explore the tools I use to bring ideas to life!
        </motion.p>

        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-xl mt-20"
          >
            Loading technologies...
          </motion.p>
        ) : error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            {error}
          </motion.p>
        ) : technologies.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            No technologies available to display.
          </motion.p>
        ) : (
          <motion.div
            variants={staggerContainer(0.1, 0.5)}
            initial="hidden"
            animate="show"
            className="mt-20 flex flex-row flex-wrap justify-center gap-10"
          >
            {technologies.map((technology, index) => (
              <motion.div
                variants={fadeIn("up", "spring", index * 0.2, 0.75)}
                className="w-28 h-36"
                key={technology.name + index}
              >
                <CanvasErrorBoundary>
                  <BallCanvas icon={technology.icon}  />
                </CanvasErrorBoundary>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper(Tech, "tech");