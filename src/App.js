import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './api/pages/Home';
import PublicLayout from './api/layouts/PublicLayout';
import AuthenticatedLayout from './api/layouts/AuthenticatedLayout'; 
import AdminLayout from './api/layouts/AdminLayout';
import CreateCategoriaArticulo from './api/pages/admin/CreateCategoriaArticulo';
import CategoriaArticuloList from './api/pages/admin/CategoriaArticuloList';
import CategoriaArticuloEdit from './api/pages/admin/CategoriaArticuloEdit';
import CreateArticulo from './api/pages/admin/CreateArticulo';
import ArticuloList from './api/pages/admin/ArticuloList';
import CreateCategoriaProductoBase from './api/pages/admin/CreateCategoriaProductoBase';
import CategoriaProductoBaseList from './api/pages/admin/CategoriaProductoBaseList';
import CategoriaProductoBaseEdit from './api/pages/admin/CategoriaProductoBaseEdit';
import CreateProductoBase from './api/pages/admin/CreateProductoBase';
import ProductoBaseList from './api/pages/admin/ProductoBaseList';
import ProductoBaseEdit from './api/pages/admin/ProductoBaseEdit';
import SignIn from './api/pages/login/SignIn';
import SignUp from './api/pages/login/SignUp';
import RecoverPassword from './api/pages/login/RecoverPassword';
import ResetPassword from './api/pages/login/ResetPassword';
import Profile from './api/pages/Profile';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="recover-password" element={<RecoverPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Rutas autenticadas (como Perfil) */}
        <Route path="/profile" element={<AuthenticatedLayout />}>
          <Route path="" element={<Profile />} />
        </Route>

        <Route path="crear-categoria-articulo" element={<CreateCategoriaArticulo />} />
        <Route path="listar-categoria-articulo" element={<CategoriaArticuloList />} />
        <Route path="editar-categoria-articulo/:categoriaId" element={<CategoriaArticuloEdit />} />

        <Route path="crear-articulo" element={<CreateArticulo />} />
        <Route path="listar-articulos" element={<ArticuloList />} />
        {/* <Route path="editar-articulo/:articuloId" element={<ArticuloEdit />} /> */}

        <Route path="crear-categoria-producto-base" element={<CreateCategoriaProductoBase />} />
        <Route path="listar-categoria-producto-base" element={<CategoriaProductoBaseList />} />
        <Route path="editar-categoria-productoBase/:categoriaId" element={<CategoriaProductoBaseEdit />} />  

        <Route path="crear-producto-base" element={<CreateProductoBase />} />
        <Route path="listar-producto-base" element={<ProductoBaseList />} />
        <Route path="editar-productoBase/:productoId" element={<ProductoBaseEdit />} />  

      </Routes>
    </>
  );
}

export default App;
