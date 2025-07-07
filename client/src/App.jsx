import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFound from './components/shared/NotFound'
import  { AdminDashboard, DashboardLayout } from './components/Admin/AdminDashboard'
import AdminTech from './components/Admin/AdminTech'
import AdminViewContact from './components/Admin/AdminViewContact'
import AdminProjects from './components/Admin/AdminProjects'
import AdminSkills from './components/Admin/AdminSkills'
import AdminViewNewsletter from './components/Admin/AdminViewNewsletter'

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/tech" element={<AdminTech />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/view-contact" element={<AdminViewContact />} />
          <Route path="/admin/view-newsletter" element={<AdminViewNewsletter />} />
        </Route>        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
