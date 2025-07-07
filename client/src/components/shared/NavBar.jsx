import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const navItems = [
    { name: 'Skills', id: 'skills' },
    { name: 'Tech', id: 'tech' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu on item click
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full backdrop-blur-md z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-16 flex justify-between items-center py-4">
        {/* Left Side: Logo/Title */}
        <div className="text-white font-bold text-lg sm:text-xl md:text-4xl">
          My <span className='text-[#915EFF]'>Portfolio</span>
        </div>

        {/* Right Side: Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="cursor-pointer text-[#dfd9ff] text-xl font-medium  hover:text-cyan-400 transition-colors duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-gray-800 px-4 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left px-4 py-2 text-[#dfd9ff] font-medium hover:bg-gray-700 hover:text-cyan-400 transition-colors duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;