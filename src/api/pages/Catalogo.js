import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import api, { getTodosProductos } from "../../api/axios";
import "./scss/Catalogo.scss";
import { Link } from "react-router-dom";
import "./scss/Home.scss";

const Catalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);
  const [todosTotal, setTodosTotal] = useState(null);
  const [todosError, setTodosError] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // 'asc' | 'desc' | ''
  const location = useLocation();

  // Cargar categorías activas al iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        const activas = response.data.filter(cat => cat.estado);
        setCategorias(activas);
        // Seleccionar "Todos los productos" por defecto si no hay búsqueda global
        const params = new URLSearchParams(location.search);
        const s = params.get("search") || "";
        if (!s) {
          await handleSeleccionarTodos();
        }
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [location.search]);

  // Cuando hay un parámetro `search` en la URL, realizar búsqueda global.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    if (!s) return; // nada que hacer

    const doSearch = async () => {
      setLoadingProductos(true);
      try {
        // Intentar usar un endpoint de búsqueda en backend
        const resp = await api.get(`buscar-productos/?search=${encodeURIComponent(s)}`);
        // Suponemos que la respuesta contiene una lista de productos
        setProductos(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.warn("Endpoint de búsqueda no disponible o fallo. Usando fallback en frontend.", err);
        // Fallback: obtener productos por categoría y filtrar en frontend
        try {
          // Asegurarnos de tener las categorías cargadas
          let cats = categorias;
          if (!cats || cats.length === 0) {
            const r = await api.get("listar-categoria-producto-base/");
            cats = r.data.filter(cat => cat.estado);
            setCategorias(cats);
          }

          const requests = cats.map(cat =>
            api
              .get(`productos-por-categoria/${cat.id}/`)
              .then(r => r.data)
              .catch(() => [])
          );
          const results = await Promise.all(requests);
          const all = results.flat().filter(p => p.categoria_estado);
          const term = s.toLowerCase();
          const filtered = all.filter(p => (p.nombre || "").toLowerCase().includes(term));
          setProductos(filtered);
        } catch (innerErr) {
          console.error("Fallback failed fetching products for search", innerErr);
          setProductos([]);
        }
      } finally {
        setLoadingProductos(false);
      }
    };

    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, categorias]);

  // Cargar productos por categoría seleccionada
  const handleSeleccionarCategoria = async categoria => {
    setCategoriaSeleccionada(categoria);
    setLoadingProductos(true);
    try {
      const response = await api.get(`productos-por-categoria/${categoria.id}/`);
      // La nueva respuesta ya viene filtrada por categoría activa,
      // y el producto no tiene un estado individual en este endpoint.
      // Asumimos que si la categoría está activa, los productos mostrados también lo están.
      const productosActivos = response.data.filter(p => p.categoria_estado);
      setProductos(productosActivos);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoadingProductos(false);
    }
  };

  // Cargar todos los productos (categoría especial)
  const handleSeleccionarTodos = async () => {
    const special = { id: 'todos', nombre: 'Todos los productos' };
    setCategoriaSeleccionada(special);
    setLoadingProductos(true);
    setTodosError(null);
    try {
      const resp = await getTodosProductos();
      console.log("getTodosProductos response:", resp);
      // El backend puede devolver dos formas:
      // 1) Array plano de productos (como `catalogo-productos/`) -> resp.data is array
      // 2) Objeto { meta: { total }, items: [...] } -> resp.data.items
      const data = resp.data;
      if (resp.status && resp.status !== 200) {
        throw new Error(`Status ${resp.status}`);
      }
      if (Array.isArray(data)) {
        setTodosTotal(data.length);
        setProductos(data);
      } else {
        setTodosTotal(data?.meta?.total ?? (Array.isArray(data?.items) ? data.items.length : null));
        setProductos(Array.isArray(data?.items) ? data.items : []);
      }
    } catch (err) {
      console.error("Error al cargar todos los productos", err);
      // Try to extract backend message if available
      const backendMsg = err?.response?.data?.error || err?.message || String(err);
      setTodosError(backendMsg);
      setProductos([]);
      setTodosTotal(null);
    } finally {
      setLoadingProductos(false);
    }
  };


  // Sincroniza `searchTerm` con el parámetro `search` en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    setSearchTerm(s);
  }, [location.search]);

  const handleSortToggle = order => {
    setSortOrder(prev => (prev === order ? "" : order));
  };

  // Lista derivada: aplica búsqueda y ordenamiento sobre `productos`
  const productosMostrados = useMemo(() => {
    let list = productos || [];
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => (p.nombre || "").toLowerCase().includes(term));
    }
    if (sortOrder === "asc") {
      list = [...list].sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (sortOrder === "desc") {
      list = [...list].sort((a, b) => Number(b.precio) - Number(a.precio));
    }
    return list;
  }, [productos, searchTerm, sortOrder]);

  return (
    <div className="catalogo-container">
      {/* Panel de Categorías */}
      <aside className="catalogo-categorias">
        <h3>CATEGORÍAS</h3>
        <ul>
          {loadingCategorias ? (
            <li>Cargando...</li>
          ) : (
            <>
              <li key="todos" className={categoriaSeleccionada?.id === 'todos' ? "activa" : ""} onClick={handleSeleccionarTodos}>
                TODOS LOS PRODUCTOS
              </li>
              {categorias.map(cat => (
                <li key={cat.id} className={categoriaSeleccionada?.id === cat.id ? "activa" : ""} onClick={() => handleSeleccionarCategoria(cat)}>
                  {cat.nombre.toUpperCase()}
                </li>
              ))}
            </>
          )}
        </ul>

        {/* Filtros de precio (panel de categorías) */}
        <div className="catalogo-filtros" style={{ marginTop: 16 }}>
          <h4>Ordenar por precio</h4>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={sortOrder === "asc"} onChange={() => handleSortToggle("asc")} />
              Menor a mayor
            </label>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={sortOrder === "desc"} onChange={() => handleSortToggle("desc")} />
              Mayor a menor
            </label>
          </div>
        </div>
      </aside>

      {/* Panel de Productos */}
      <main className="catalogo-productos">
        {categoriaSeleccionada && (
          <div className="catalogo-header">
            <h2>
              {categoriaSeleccionada.nombre.toUpperCase()}
              {categoriaSeleccionada.id === 'todos' && todosTotal != null ? ` (${todosTotal})` : ''}
            </h2>
          </div>
        )}

        {categoriaSeleccionada?.id === 'todos' && todosError && (
          <div className="catalogo-error" style={{ margin: '8px 0', color: '#a00' }}>
            <p>Error al cargar todos los productos: {todosError}</p>
            <button className="btn btn-rosado" onClick={handleSeleccionarTodos}>Reintentar</button>
          </div>
        )}

        {loadingProductos ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="productos-grid">
            {productosMostrados.map(producto => (
              <div key={producto.id} className="producto-card">
                <Link to={`/producto/${producto.id}`} title={producto.nombre}>
                  <img
                    src={producto.imagen_url || "/placeholder.jpg"} // usa una imagen por defecto si no hay
                    alt={producto.nombre}
                  />
                </Link>
                <h3>{producto.nombre.toUpperCase()}</h3>
                <p>{producto.descripcion}</p>
                <p className="precio">${producto.precio.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalogo;
