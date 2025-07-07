import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex items-center justify-center overflow-hidden">
      <style>{`
        .nebula-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(145, 94, 255, 0.3) 0%, rgba(17, 24, 39, 1) 60%);
          overflow: hidden;
        }
        .glowing-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(145, 94, 255, 0.9) 0%, rgba(34, 211, 238, 0) 70%);
          animation: orbit 12s ease-in-out infinite;
        }
        .glowing-orb:nth-child(1) { width: 120px; height: 120px; top: 10%; left: 15%; animation-delay: 0s; }
        .glowing-orb:nth-child(2) { width: 160px; height: 160px; top: 70%; left: 80%; animation-delay: 3s; }
        .glowing-orb:nth-child(3) { width: 80px; height: 80px; top: 50%; left: 30%; animation-delay: 6s; }
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
        .action-button {
          background: linear-gradient(45deg, #915EFF, #22d3ee);
          border: 2px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
        }
        .action-button:hover {
          background: linear-gradient(45deg, #22d3ee, #915EFF);
          box-shadow: 0 0 25px rgba(34, 211, 238, 1);
          transform: scale(1.05);
        }
      `}</style>
      <div className="nebula-bg">
        <div className="glowing-orb"></div>
        <div className="glowing-orb"></div>
        <div className="glowing-orb"></div>
        <div className="circuit-matrix"></div>
      </div>

      <motion.div
        className="relative z-10 text-center glass-panel p-8 md:p-12 rounded-xl max-w-lg mx-4"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-[#915EFF] mb-4"
          variants={textVariants}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-[#dfd9ff] mb-6 font-medium"
          variants={textVariants}
        >
          Oops! The page you're looking for is lost in the digital cosmos.
        </motion.p>
        <motion.p
          className="text-base md:text-lg text-[#dfd9ff] mb-8"
          variants={textVariants}
        >
          Let's navigate back to safety!
        </motion.p>
        <motion.div variants={textVariants}>
          <Link
            to="/"
            className="inline-block px-8 py-4 action-button text-white rounded-full font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Homepage
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;