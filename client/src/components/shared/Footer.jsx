/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../api';

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const inputVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)',
    transition: { duration: 0.3, ease: [0.6, 0.01, 0.05, 0.95] },
  },
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const actionTexts = [
    { newsletter: 'Join our newsletter for exclusive updates' },
    { newsletter: 'Stay in the loop with Softweb Elevation' },
    { newsletter: 'Get the latest tech insights in your inbox' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActionIndex((prevIndex) => (prevIndex + 1) % actionTexts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email', { position: 'top-right', autoClose: 3000 });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/newsletter`, { email });
      setEmail('');
      toast.success('Subscribed successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <footer className="relative bg-[#050816] text-white py-16 px-6 md:px-20 overflow-hidden">
      <ToastContainer />
      <style>{`
        .nebula-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .glowing-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(145, 94, 255, 0.9) 0%, rgba(34, 211, 238, 0) 70%);
          animation: orbit 12s ease-in-out infinite;
        }
        .glowing-orb:nth-child(1) { width: 100px; height: 100px; top: 15%; left: 10%; animation-delay: 0s; }
        .glowing-orb:nth-child(2) { width: 140px; height: 140px; top: 60%; left: 85%; animation-delay: 3s; }
        .glowing-orb:nth-child(3) { width: 80px; height: 80px; top: 80%; left: 30%; animation-delay: 6s; }
        .energy-stream {
          position: absolute;
          width: 3px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(145, 94, 255, 0.9), rgba(34, 211, 238, 0));
          animation: energyFlow 4s linear infinite;
        }
        .energy-stream:nth-child(4) { left: 20%; top: 0; animation-delay: 0s; }
        .energy-stream:nth-child(5) { left: 50%; top: 0; animation-delay: 1.5s; }
        .energy-stream:nth-child(6) { left: 80%; top: 0; animation-delay: 3s; }
        .circuit-matrix {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10,50 H30 L40,30 H60 L70,70 H90 M20,20 V40 H80 V60 M30,10 H50 V90' fill='none' stroke='rgba(145,94,255,0.2)' stroke-width='1'/%3E%3Ccircle cx='40' cy='30' r='2' fill='rgba(145,94,255,0.5)'/%3E%3Ccircle cx='70' cy='70' r='2' fill='rgba(145,94,255,0.5)'/%3E%3C/svg%3E");
          background-size: 60px;
          opacity: 0.3;
          animation: matrixScroll 25s linear infinite;
          transform: perspective(1200px) rotateX(20deg);
          transform-origin: top;
        }
        @keyframes orbit {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 0.8; }
        }
        @keyframes energyFlow {
          0% { transform: translateY(-100%); opacity: 0.9; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes matrixScroll {
          0% { background-position: 0 0; }
          100% { background-position: 60px 0; }
        }
        .glass-panel {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 4px 30px rgba(145, 94, 255, 0.4);
        }
        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(145, 94, 255, 0.6);
          color: white;
          backdrop-filter: blur(6px);
          transition: all 0.3s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: rgba(34, 211, 238, 1);
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.8);
        }
        .subscribe-button {
          background: linear-gradient(45deg, #915EFF, #22d3ee);
          border: 2px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
        }
        .subscribe-button:hover:enabled {
          background: linear-gradient(45deg, #22d3ee, #915EFF);
          box-shadow: 0 0 25px rgba(34, 211, 238, 1);
          transform: scale(1.05);
        }
        .subscribe-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .social-link {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .social-link:hover {
          transform: scale(1.3);
          color: #22d3ee;
        }
      `}</style>
      <div className="nebula-bg">
        <div className="glowing-orb"></div>
        <div className="glowing-orb"></div>
        <div className="glowing-orb"></div>
        <div className="energy-stream"></div>
        <div className="energy-stream"></div>
        <div className="energy-stream"></div>
        <div className="circuit-matrix"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Newsletter Section */}
          <div className="col-span-1 glass-panel p-6 rounded-xl">
            <AnimatePresence mode="wait">
              <motion.h3
                key={actionTexts[currentActionIndex].newsletter}
                className="text-2xl md:text-3xl font-extrabold text-[#915EFF] mb-4"
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {actionTexts[currentActionIndex].newsletter}
              </motion.h3>
            </AnimatePresence>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <motion.input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full px-5 py-3 rounded-full text-white placeholder-gray-400 shadow-md"
                whileHover="hover"
                required
              />
              <motion.button
                type="submit"
                className="cursor-pointer subscribe-button px-6 py-3 rounded-full text-white font-semibold"
                disabled={!email.trim()}
                variants={inputVariants}
                whileHover={email.trim() ? "hover" : {}}
                whileTap={email.trim() ? { scale: 0.95 } : {}}
              >
                Subscribe
              </motion.button>
            </form>
          </div>

          {/* Contact and Social Media */}
          <div className="col-span-1 glass-panel p-6 rounded-xl">
            <h3 className="text-2xl font-extrabold text-[#915EFF] mb-4">Connect with Me</h3>
            <div className="flex items-center mb-6">
              <span className="text-[#dfd9ff] font-medium mr-3">ny_kahlouche@esi.dz</span>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/kingofdead6"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link text-[#dfd9ff] text-3xl"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/kahlouche-youcef-8b4288306/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link text-[#dfd9ff] text-3xl"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Agency Link */}
          <div className="col-span-1 glass-panel p-6 rounded-xl">
            <h3 className="text-2xl font-extrabold text-[#915EFF] mb-4">Softweb Elevation</h3>
            <p className="text-[#dfd9ff] mb-6 font-medium">
              Discover innovative web solutions with our agency.
            </p>
            <motion.a
              href="https://softwebelevation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#915EFF] to-cyan-400 text-white rounded-full font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Visit Website
            </motion.a>
          </div>
        </div>

        <div className="border-t border-[#915EFF]/50 pt-8 text-center">
          <p className="text-[#dfd9ff] text-sm font-medium">
            © {new Date().getFullYear()} <a href="https://softwebelevation.com" className="hover:text-cyan-400">Softweb Elevation</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;