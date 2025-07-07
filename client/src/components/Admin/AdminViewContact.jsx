/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../../../api';

const AdminViewContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // Fetch contact messages
        const response = await axios.get(`${API_BASE_URL}/contactus`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch contact messages', {
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

  const handleToggleSeen = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/contactus/${id}/toggle-seen`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setContacts((prev) =>
        prev.map((contact) => (contact._id === id ? response.data : contact))
      );
      toast.success(`Contact marked as ${response.data.seen ? 'seen' : 'unseen'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update seen status', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contactus/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      toast.success('Contact message deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete contact message', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen  pb-8 px-4 sm:px-6 lg:px-8 ">
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
          <h1 className="text-3xl font-extrabold text-[#915EFF] mb-8">Manage Contact Messages</h1>

          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#dfd9ff] text-xl"
            >
              Loading...
            </motion.p>
          ) : contacts.length === 0 ? (
            <p className="text-center text-[#dfd9ff] text-lg">No contact messages found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {contacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 glass-panel rounded-lg ${contact.seen ? 'opacity-75' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[#dfd9ff]">{contact.name}</h2>
                      <p className="text-[#dfd9ff]/80">{contact.email}</p>
                    </div>
                    <p className="text-[#dfd9ff]/80 mt-2 sm:mt-0">
                      Status: {contact.seen ? 'Seen' : 'Unseen'}
                    </p>
                  </div>
                  <p className="text-[#dfd9ff] mb-4">{contact.message}</p>
                  <div className="flex justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleSeen(contact._id)}
                      className="cursor-pointer action-button text-white flex items-center gap-2"
                    >
                      {contact.seen ? <FaEyeSlash /> : <FaEye />}
                      Mark as {contact.seen ? 'Unseen' : 'Seen'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(contact._id)}
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
      </div>
    </div>
  );
};

export default AdminViewContact;