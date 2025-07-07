/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGithub, FaGlobe } from "react-icons/fa";
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

// ProjectCard Component
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  liveSiteLink,
  githubLink,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-[#151030] p-5 rounded-2xl sm:w-[400px] w-full shadow-cyan-400 shadow-xl"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image || '/placeholder.png'}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover gap-2">
            <button
              onClick={() => window.open(githubLink, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              aria-label="View source code on GitHub"
            >
              <FaGithub className="w-1/2 h-1/2 text-white" />
            </button>
            {liveSiteLink && (
              <button
                onClick={() => window.open(liveSiteLink, "_blank")}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
                aria-label="View live website"
              >
                <FaGlobe className="w-1/2 h-1/2 text-white" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-[#aaa6c3] text-[14px] line-clamp-3">{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={`${name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

// Projects Component
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        const mainPageProjects = response.data.filter(project => project.showOnMainPage).map(project => ({
          name: project.name,
          description: project.description,
          tags: project.techUsed.map(tech => ({ name: tech, color: "text-blue-500" })),
          image: project.picture,
          githubLink: project.githubLink,
          liveSiteLink: project.liveSiteLink || '',
        }));
        setProjects(mainPageProjects);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
        toast.error(err.response?.data?.message || 'Failed to fetch projects', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
          <motion.p
            variants={textVariant(0.2)}
            className={`${styles.sectionSubText} text-[#aaa6c3]`}
          >
            My work
          </motion.p>
          <motion.h2
            variants={textVariant(0.3)}
            className={`${styles.sectionHeadText}`}
          >
            Projects.
          </motion.h2>
        </motion.div>

        <div className="w-full flex">
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className="mt-3 text-[#aaa6c3] text-[17px] max-w-3xl leading-[30px]"
          >
            The following projects showcase my skills and experience through
            real-world examples of my work. Each project is briefly described with
            links to code repositories and live demos. They reflect my ability to
            solve complex problems, work with different technologies, and manage
            projects effectively.
          </motion.p>
        </div>

        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-xl mt-20"
          >
            Loading projects...
          </motion.p>
        ) : error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            {error}
          </motion.p>
        ) : projects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#aaa6c3] text-lg mt-20"
          >
            No projects available to display.
          </motion.p>
        ) : (
          <div className="mt-20 flex flex-col sm:flex-row sm:flex-wrap gap-10">
            {projects.map((project, index) => (
              <ProjectCard key={`project-${index}`} index={index} {...project} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper(Projects, "projects");