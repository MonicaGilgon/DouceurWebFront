import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './api/pages/Home'
import PublicLayout from './api/layouts/PublicLayout'
import AdminLayout from './api/layouts/AdminLayout'
import CreateCategoriaArticulo from './api/pages/admin/CreateCategoriaArticulo';
import SignIn from './api/pages/login/SignIn'
import SignUp from './api/pages/login/SignUp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* añadir más rutas públicas */}
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="crear-categoria-articulo" element={<CreateCategoriaArticulo />} />
        {/* Agrega más rutas admin aquí si necesitas */}
      </Route>
    </Routes>
  )
}

export default App
