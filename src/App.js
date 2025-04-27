import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Home from "./api/pages/Home"
import PublicLayout from "./api/layouts/PublicLayout"
import AuthenticatedLayout from "./api/layouts/AuthenticatedLayout"
import AdminLayout from "./api/layouts/AdminLayout"
import VendedorLayout from "./api/layouts/VendedorLayout"
import CreateCategoriaArticulo from "./api/pages/admin/CreateCategoriaArticulo"
import CategoriaArticuloList from "./api/pages/admin/CategoriaArticuloList"
import CategoriaArticuloEdit from "./api/pages/admin/CategoriaArticuloEdit"
import CreateArticulo from "./api/pages/admin/CreateArticulo"
import ArticuloList from "./api/pages/admin/ArticuloList"
import CreateCategoriaProductoBase from "./api/pages/admin/CreateCategoriaProductoBase"
import CategoriaProductoBaseList from "./api/pages/admin/CategoriaProductoBaseList"
import CategoriaProductoBaseEdit from "./api/pages/admin/CategoriaProductoBaseEdit"
import CreateProductoBase from "./api/pages/admin/CreateProductoBase"
import ProductoBaseList from "./api/pages/admin/ProductoBaseList"
import ProductoBaseEdit from "./api/pages/admin/ProductoBaseEdit"
import SignIn from "./api/pages/login/SignIn"
import SignUp from "./api/pages/login/SignUp"
import RecoverPassword from "./api/pages/login/RecoverPassword"
import ResetPassword from "./api/pages/login/ResetPassword"
import Profile from "./api/pages/Profile"
import ClienteList from "./api/pages/admin/ClienteList"
import ClienteEdit from "./api/pages/admin/ClienteEdit"
import CreateVendedor from "./api/pages/admin/CreateVendedor"
import VendedorList from "./api/pages/admin/SellerList"
import VendedorEdit from "./api/pages/admin/SellerEdit"
import AdminRoute from "./api/components/ProtectedRoutes/AdminRoute"
import VendedorRoute from "./api/components/ProtectedRoutes/VendedorRoute"
import AuthenticatedRoute from "./api/components/ProtectedRoutes/AuthenticatedRoute"
import AccessDenied from "./api/pages/AccessDenied" // Crea esta página para mostrar un mensaje de acceso denegado

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
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>

        {/* Rutas autenticadas (como Perfil) */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="/profile" element={<AuthenticatedLayout />}>
            <Route path="" element={<Profile />} />
          </Route>
        </Route>

        {/* Rutas de administración - Protegidas para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="crear-categoria-articulo" element={<CreateCategoriaArticulo />} />
            <Route path="listar-categoria-articulo" element={<CategoriaArticuloList />} />
            <Route path="editar-categoria-articulo/:categoriaId" element={<CategoriaArticuloEdit />} />

            <Route path="crear-articulo" element={<CreateArticulo />} />
            <Route path="listar-articulos" element={<ArticuloList />} />
            {/* <Route path="editar-articulo/:articuloId" element={<ArticuloEdit />} /> */}

            <Route path="crear-categoria-producto-base" element={<CreateCategoriaProductoBase />} />
            <Route path="listar-categoria-producto-base" element={<CategoriaProductoBaseList />} />
            <Route path="editar-categoria-producto-base/:categoriaId" element={<CategoriaProductoBaseEdit />} />

            <Route path="crear-producto-base" element={<CreateProductoBase />} />
            <Route path="listar-producto-base" element={<ProductoBaseList />} />
            <Route path="editar-producto-base/:productoId" element={<ProductoBaseEdit />} />

            <Route path="crear-vendedor" element={<CreateVendedor />} />
            <Route path="listar-vendedores" element={<VendedorList />} />
            <Route path="editar-vendedor/:sellerId" element={<VendedorEdit />} />

            <Route path="listar-clientes" element={<ClienteList />} />
            <Route path="editar-cliente/:clienteId" element={<ClienteEdit />} />
          </Route>
        </Route>




        {/* Rutas de administración - Protegidas para administradores */}
        <Route element={<VendedorRoute />}>
          <Route path="/vendedor" element={<VendedorLayout />}>
          </Route>
        </Route>








        {/* Ruta para manejar rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
