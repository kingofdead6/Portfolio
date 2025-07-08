/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../api';

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
  hidden: { y: -50, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", duration: 1.25, delay: delay } },
});

const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: { x: 0, y: 0, opacity: 1, transition: { type: type, delay: delay, duration: duration, ease: "easeOut" } },
});

const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: { transition: { staggerChildren: staggerChildren, delayChildren: delayChildren || 0 } },
});

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


const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full bg-gradient-to-r from-[#915EFF] to-[#22d3ee] p-[1px] rounded-[20px] shadow-lg"
    >
      <div
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-[#1a0b2e] rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1750716685/AboutUsBg_y6n5fu.jpg')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'soft-light',
          opacity: 0.9,
        }}
      >
        <img
          src={icon || '/placeholder.png'}
          alt={title}
          className="w-16 h-16 object-contain"
          onError={(e) => (e.target.src = '/placeholder.png')}
        />
        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/skills`);
        const mainPageSkills = response.data
          .filter(skill => skill.showOnMainPage)
          .map(skill => ({
            title: skill.name,
            icon: skill.picture,
          }));
        setSkills(mainPageSkills.slice(0, 4)); // Limit to 4 skills
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch skills');
        toast.error(err.response?.data?.message || 'Failed to fetch skills', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      animate="show"
      className={`bg-[#050816] ${styles.paddingX} ${styles.paddingY}`}
    >
      <ToastContainer />
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show">
          <motion.p variants={textVariant(0.2)} className={`${styles.sectionSubText} text-[#aaa6c3]`}>
            My Expertise
          </motion.p>
          <motion.h2 variants={textVariant(0.3)} className={`${styles.sectionHeadText}`}>
            Skills.
          </motion.h2>
        </motion.div>

        <motion.p
          variants={fadeIn("up", "spring", 0.4, 1)}
          className="mt-4 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px]"
        >
          I’m a dedicated <span className="font-semibold">full-stack developer</span> and <span className="font-semibold">computer science student</span> based in Algeria, with a strong foundation in <span className="font-semibold">JavaScript</span>, <span className="font-semibold">TypeScript</span>, and modern frameworks like <span className="font-semibold">React</span>, <span className="font-semibold">Vue</span>, and <span className="font-semibold">Node.js</span>. Below are some of my key skills, showcasing my ability to build engaging, user-friendly web applications and solve complex problems efficiently.
        </motion.p>

        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-xl mt-20"
          >
            Loading skills...
          </motion.p>
        ) : error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            {error}
          </motion.p>
        ) : skills.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            No skills available to display.
          </motion.p>
        ) : (
          <motion.div
            variants={staggerContainer(0.1, 0.5)}
            initial="hidden"
            animate="show"
            className="mt-20 flex flex-col sm:flex-row sm:flex-nowrap gap-10"
          >
            {skills.map((skill, index) => (
              <ServiceCard key={skill.title} index={index} {...skill} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const WrappedSkills = SectionWrapper(Skills, "skills");

export default WrappedSkills;