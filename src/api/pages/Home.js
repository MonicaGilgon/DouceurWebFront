import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bienvenido a DOUCEUR</h2>
      {/* Aquí va tu formulario de autenticación */}
    </div>
  );
};

export default Home;
