import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './scss/Profile.scss';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/');
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el perfil: ' + err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No se encontraron datos</div>;

    const isClient = userData.rol === 'cliente';

    return (
        <div className="profile-container">
            <h2>{isClient ? 'Tu Información' : `Información del ${userData.rol === 'admin' ? 'Administrador' : 'Vendedor'}`}</h2>
            <div className="profile-details">
                <div className="form-group">
                    <label>N° de Documento:</label>
                    <input type="text" value={userData.document_number || 'No especificado'} disabled />
                </div>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" value={userData.nombre_completo} disabled />
                </div>
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input type="email" value={userData.correo} disabled />
                </div>
                <div className="form-group">
                    <label>Teléfono:</label>
                    <input type="text" value={userData.telefono || 'No especificado'} disabled />
                </div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input type="text" value={userData.direccion || 'No especificado'} disabled />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" value="********" disabled />
                </div>
            </div>

            {isClient && userData.orders.length > 0 && (
                <div className="orders-section">
                    <h3>Tus Pedidos</h3>
                    <div className="orders-list">
                        {userData.orders.map(order => (
                            <div key={order.id} className="order-item">
                                <span className="order-name">
                                    {order.items.map(item => item.articulo.nombre).join(', ')}
                                </span>
                                <span className="order-total">
                                    ${!isNaN(parseFloat(order.total_amount))
                                        ? parseFloat(order.total_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : '0.00'}
                                </span>
                                <button className="delete-btn">Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="profile-actions">
                <button className="cancel-btn">{isClient ? 'Volver' : 'Cancelar'}</button>
                <button className="edit-btn">Editar Información</button>
            </div>
        </div>
    );
};

export default Profile;