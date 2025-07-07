import React from 'react'
import Hero from '../../components/Home/Hero'
import AboutUs from '../../components/Home/AboutUs'
import Techs from '../../components/Home/Techs'
import Works from '../../components/Home/Works'
import Contact from '../../components/Home/Contact'
import StarsCanvas from '../../components/canvas/Stars'
import Navbar from '../../components/shared/NavBar'
import Footer from '../../components/shared/Footer'

const HomePage = () => {
  return (
    <div className='relative z-0'>
      <Navbar />
      <Hero />
      <AboutUs />
      <Techs />
      <Works />
      <Contact />
      <StarsCanvas />  
      <Footer />  
    </div>
  )
}

export default HomePage