/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTools, FaCode, FaProjectDiagram, FaEnvelope, FaNewspaper } from 'react-icons/fa';
import { API_BASE_URL } from '../../../api';

const navItems = [
  { label: 'Skills', key: 'skills', icon: <FaTools className="h-6 w-6" />, path: '/admin/skills' },
  { label: 'Tech', key: 'tech', icon: <FaCode className="h-6 w-6" />, path: '/admin/tech' },
  { label: 'Projects', key: 'projects', icon: <FaProjectDiagram className="h-6 w-6" />, path: '/admin/projects' },
  { label: 'Contact', key: 'contact', icon: <FaEnvelope className="h-6 w-6" />, path: '/admin/view-contact' },
  { label: 'Newsletter', key: 'newsletter', icon: <FaNewspaper className="h-6 w-6" />, path: '/admin/view-newsletter' },
];

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to access the dashboard', {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/');
          return;
        }
        await axios.get(`${API_BASE_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Authentication failed', {
          position: 'top-right',
          autoClose: 3000,
        });
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    verifyToken();
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-900 to-purple-900">
      <ToastContainer />
      <style>{`
        .wave-bg {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='none' stroke='rgba(145, 94, 255, 0.2)' stroke-width='2' d='M0,160 C320,100 640,100 960,160 C1280,220 1440,220 1440,220'/%3E%3Ccircle cx='360' cy='120' r='4' fill='rgba(145, 94, 255, 0.5)'/%3E%3Ccircle cx='720' cy='180' r='4' fill='rgba(34, 211, 238, 0.5)'/%3E%3Ccircle cx='1080' cy='140' r='4' fill='rgba(145, 94, 255, 0.5)'/%3E%3C/svg%3E");
          opacity: 0.3;
          background-size: 200%;
          animation: moveWave 8s linear infinite;
          pointer-events: none;
        }
        @keyframes moveWave {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        .nav-button {
          background: linear-gradient(45deg, #915EFF, #22d3ee);
          border: 1px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
          transition: all 0.3s ease;
          font-size: 1rem;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
        }
        .nav-button:hover {
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.7);
          transform: scale(1.05);
        }
        .sidebar {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(16px);
          border-right: 1px solid rgba(145, 94, 255, 0.5);
        }
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 40;
          background: rgba(17, 24, 39, 0.9);
          backdrop-filter: blur(16px);
        }
        .glow-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(145, 94, 255, 0.6);
          border-radius: 50%;
          filter: blur(3px);
          animation: blink 4s ease-in-out infinite;
        }
        .glow-dot:nth-child(1) { top: 15%; left: 25%; animation-delay: 0s; }
        .glow-dot:nth-child(2) { top: 65%; left: 75%; animation-delay: 1s; }
        .glow-dot:nth-child(3) { top: 45%; left: 35%; animation-delay: 2s; }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @media (max-width: 768px) {
          .nav-button {
            font-size: 1.25rem;
            padding: 0.75rem 2rem;
          }
        }
      `}</style>

      {/* Sidebar for Desktop */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
        className="fixed top-0 left-0 h-screen w-64 sidebar hidden md:block z-50"
      >
        <div className="wave-bg"></div>
        <div className="relative z-10 p-6">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#915EFF] to-cyan-400 mb-8">
            Admin Dashboard
          </div>
          <div className="space-y-3">
            {navItems.map(({ label, key, icon, path }, index) => (
              <motion.button
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(path)}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-[#dfd9ff] hover:bg-gradient-to-r hover:from-[#915EFF] hover:to-cyan-400 hover:text-white transition-all duration-300"
              >
                {icon}
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-950/30 via-indigo-900/30 to-purple-900/30 backdrop-blur-2xl border-b border-[#915EFF]/20 shadow-lg md:hidden"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 relative">
          <div className="wave-bg"></div>
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#915EFF] to-cyan-400 relative z-10">
              Admin Dashboard
            </div>
            <div className="flex items-center relative z-10">
              <motion.button
                onClick={toggleMenu}
                className="cursor-pointer ml-2 p-2 text-[#dfd9ff] hover:bg-[#915EFF]/50 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="mobile-menu"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map(({ label, key, icon, path }, index) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => {
                      navigate(path);
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-[#dfd9ff] hover:bg-gradient-to-r hover:from-[#915EFF] hover:to-cyan-400 hover:text-white"
                  >
                    {icon}
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen relative">
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />
        <Outlet />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.6, 0.01, 0.05, 0.95] }}
      className="max-w-7xl mx-auto p-6 sm:p-8 bg-gray-900/50 backdrop-blur-md rounded-xl border border-[#915EFF]/20"
    >
      <h1 className="text-3xl font-extrabold text-[#915EFF] mb-6">Welcome to the Admin Dashboard</h1>
      <p className="text-[#dfd9ff] mb-8">Manage your portfolio content efficiently from here.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navItems.map(({ label, key, icon, path }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-[#915EFF]/30 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              {icon}
              <h2 className="text-xl font-semibold text-[#dfd9ff]">{label}</h2>
            </div>
            <p className="text-[#dfd9ff]/80 mb-4">Manage your {label.toLowerCase()} content.</p>
            <button
              onClick={() => navigate(path)}
              className="cursor-pointer nav-button text-white"
            >
              Go to {label}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export { DashboardLayout, AdminDashboard };