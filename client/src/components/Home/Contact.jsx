/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../canvas/Loader";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../api';

// Styles
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",
  heroHeadText:
    "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",
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

const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
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

// Earth Component
const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

// EarthCanvas Component
const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

// SectionWrapper HOC
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

// Contact Component
const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      try {
        // Attempt admin login
        const loginRes = await axios.post(`${API_BASE_URL}/admin/login`, {
          username: form.name,
          email: form.email,
          password: form.message,
        });
        localStorage.setItem('token', loginRes.data.token);
        toast.success('Login successful! Redirecting to dashboard...', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      } catch (loginError) {
        // If login fails, save as contact message
        try {
          await axios.post(`${API_BASE_URL}/contactus`, {
            name: form.name,
            email: form.email,
            message: form.message,
          });
          toast.success('Message sent successfully!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
          setForm({ name: '', email: '', message: '' });
        } catch (contactError) {
          toast.error('Failed to send message. Please try again.', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      animate="show"
      className={`${styles.paddingX} ${styles.paddingY}`}
    >
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={textVariant(0.2)}
            className={`${styles.sectionSubText} text-[#aaa6c3]`}
          >
            Get in touch
          </motion.p>
          <motion.h2
            variants={textVariant(0.3)}
            className={`${styles.sectionHeadText}`}
          >
            Contact.
          </motion.h2>
        </motion.div>

        <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] bg-[#100d25] p-8 rounded-2xl"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className='mt-12 flex flex-col gap-8'
            >
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>Your Name</span>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className='bg-[#151030] py-4 px-6 placeholder:text-[#aaa6c3] text-white rounded-lg outline-none border-none font-medium'
                  required
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>Your Email</span>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className='bg-[#151030] py-4 px-6 placeholder:text-[#aaa6c3] text-white rounded-lg outline-none border-none font-medium'
                  required
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>Your Message</span>
                <textarea
                  rows={7}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  placeholder='What you want to say?'
                  className='bg-[#151030] py-4 px-6 placeholder:text-[#aaa6c3] text-white rounded-lg outline-none border-none font-medium'
                  required
                />
              </label>

              <button
                type='submit'
                className='cursor-pointer shadow-xl hover:shadow-cyan-400 bg-[#151030] hover:bg-[#151040] hover:scale-105 transition-all duration-300 py-3 px-8 rounded-xl outline-none w-fit text-white font-bold'
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default SectionWrapper(Contact, "contact");