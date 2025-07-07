import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../../../api';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const AdminTech = () => {
  const [techStacks, setTechStacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', picture: null, showOnMainPage: false });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyTokenAndFetch = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to access this page', {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/contact');
          return;
        }

        // Verify token
        await axios.get(`${API_BASE_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch tech stacks
        const response = await axios.get(`${API_BASE_URL}/techstack`);
        setTechStacks(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch tech stacks', {
          position: 'top-right',
          autoClose: 3000,
        });
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/contact');
        }
      } finally {
        setLoading(false);
      }
    };
    verifyTokenAndFetch();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      showOnMainPage: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.picture) {
        data.append('picture', formData.picture);
      }
      data.append('showOnMainPage', formData.showOnMainPage.toString());

      const response = await axios.post(`${API_BASE_URL}/techstack`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTechStacks((prev) => [...prev, response.data]);
      setFormData({ name: '', picture: null, showOnMainPage: false });
      setIsModalOpen(false);
      toast.success('Tech stack added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add tech stack', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleShow = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/techstack/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTechStacks((prev) =>
        prev.map((tech) => (tech._id === id ? response.data : tech))
      );
      toast.success('Tech stack visibility updated', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update visibility', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/techstack/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTechStacks((prev) => prev.filter((tech) => tech._id !== id));
      toast.success('Tech stack deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete tech stack', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen pb-8 px-4 sm:px-6 lg:px-8">
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
        .action-button {
          background: linear-gradient(45deg, #915EFF, #22d3ee);
          border: 1px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
          transition: all 0.3s ease;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
        }
        .action-button:hover {
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.7);
          transform: scale(1.05);
        }
        .glass-panel {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(145, 94, 255, 0.5);
          box-shadow: 0 4px 30px rgba(145, 94, 255, 0.4);
        }
        .modal-bg {
          background: rgba(17, 24, 39, 0.9);
          backdrop-filter: blur(10px);
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
      `}</style>

      <div className="relative">
        <div className="wave-bg"></div>
        <div className="glow-dot" />
        <div className="glow-dot" />
        <div className="glow-dot" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#915EFF]">Manage Tech Stack</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer action-button text-white flex items-center gap-2"
            >
              <FaPlus /> Add New Tech
            </motion.button>
          </div>

          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#dfd9ff] text-xl"
            >
              Loading...
            </motion.p>
          ) : techStacks.length === 0 ? (
            <p className="text-center text-[#dfd9ff] text-lg">No tech stacks found. Add one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStacks.map((tech) => (
                <motion.div
                  key={tech._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 glass-panel rounded-lg"
                >
                  <img
                    src={tech.picture || '/placeholder.png'} // Fallback image
                    alt={tech.name}
                    className="w-full h-32 object-contain rounded-md mb-4"
                    onError={(e) => (e.target.src = '/placeholder.png')} // Handle broken image
                  />
                  <h2 className="text-xl font-semibold text-[#dfd9ff] mb-2">{tech.name}</h2>
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleShow(tech._id)}
                      className="cursor-pointer action-button text-white flex items-center gap-2"
                    >
                      {tech.showOnMainPage ? <FaEyeSlash /> : <FaEye />}
                      {tech.showOnMainPage ? 'Hide' : 'Show'} on Main
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(tech._id)}
                      className="cursor-pointer p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 modal-bg flex items-center justify-center z-50"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="glass-panel p-6 rounded-lg max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-[#915EFF] mb-4">Add New Tech</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#dfd9ff] mb-1">Tech Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800/50 text-white border border-[#915EFF]/50 rounded-md focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#dfd9ff] mb-1">Tech Image</label>
                    <input
                      type="file"
                      name="picture"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-2 bg-gray-800/50 text-[#dfd9ff] border border-[#915EFF]/50 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showOnMainPage"
                      checked={formData.showOnMainPage}
                      onChange={handleCheckboxChange}
                      className="cursor-pointer mr-2 accent-cyan-400 "
                    />
                    <label className="text-[#dfd9ff]">Show on Main Page</label>
                  </div>
                  <div className="flex justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer px-4 py-2 bg-gray-700 text-[#dfd9ff] rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer action-button text-white disabled:opacity-50"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Tech'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminTech;