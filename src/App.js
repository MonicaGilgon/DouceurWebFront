import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './api/pages/Home'
import Login from './api/pages/Login'
import PublicLayout from './api/layouts/PublicLayout'
// import Dashboard from './api/pages/Dashboard'

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas anidadas con layout */}
      <Route path="/admin" element={<PublicLayout />}>
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
      </Route>
    </Routes>
  )
}

export default App
