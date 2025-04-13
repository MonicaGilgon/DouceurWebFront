import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './api/pages/Home'
import PublicLayout from './api/layouts/PublicLayout'
import AdminLayout from './api/layouts/AdminLayout'
import CreateCategoriaArticulo from './api/pages/admin/CreateCategoriaArticulo';
import CategoriaArticuloEdit from './api/pages/admin/CategoriaArticuloEdit';
import CategoriaArticuloList from './api/pages/admin/CategoriaArticuloList';
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
        <Route path="editar-categoria-articulo/:categoriaId" element={<CategoriaArticuloEdit />} />
        <Route path="listar-categoria-articulo" element={<CategoriaArticuloList />} />
      </Route>
    </Routes>
  )
}

export default App
