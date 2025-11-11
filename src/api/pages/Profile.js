import React, { useEffect, useState, useCallback, useRef} from 'react';
import api from '../../api/axios';
import './scss/Profile.scss';
import { useNavigate, Link } from 'react-router-dom';

const formatStatus = (status) => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const Profile = () => {
    const initialLoadRef = useRef(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        document_number: '',
        nombre_completo: '',
        direccion: '',
        telefono: '',
        correo: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isSubmittingData, setIsSubmittingData] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [setModalMessage] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState({
        current_password: false,
        new_password: false,
        confirm_password: false
    });

    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get("/profile/");
            setUserData(response.data);
            if (!initialLoadRef.current) { // Solo inicializa formData en la primera carga
                setFormData({
                    document_number: response.data.document_number || "",
                    nombre_completo: response.data.nombre_completo || "",
                    direccion: response.data.direccion || "",
                    telefono: response.data.telefono || "",
                    correo: response.data.correo || "",
                });
                initialLoadRef.current = true; // Marca que la carga inicial ha ocurrido
            }
            setLoading(false);
        } catch (err) {
            setError("Error al cargar el perfil: " + err.message);
            setLoading(false);
        }
    }, []);

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [field]: !passwordVisibility[field]
        });
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    

    useEffect(() => {
        const interval = setInterval(fetchProfile, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, [fetchProfile]);

    const validateForm = () => {
        const errors = {};
        if (!formData.nombre_completo) errors.nombre_completo = "El nombre es obligatorio.";
        if (!formData.telefono) errors.telefono = "El teléfono es obligatorio.";
        if (!formData.correo) {
            errors.correo = "El correo es obligatorio.";
        } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.correo)) {
            errors.correo = "El correo no tiene un formato válido.";
        }
        if (!formData.document_number) {
            errors.document_number = "El número de documento es obligatorio.";
        } else if (formData.document_number.length < 5) {
            errors.document_number = "El número de documento debe tener al menos 5 caracteres.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleGoBack = () => {
        if (!userData || !userData.rol) {
            navigate('/');
            return;
        }
        if (userData.rol === 'admin') {
            navigate('/admin');
        } else if (userData.rol === 'vendedor') {
            navigate('/vendedor');
        } else {
            navigate('/');
        }
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordData.current_password) errors.current_password = "La contraseña actual es obligatoria.";
        if (!passwordData.new_password) {
            errors.new_password = "La nueva contraseña es obligatoria.";
        } else {
            if (passwordData.new_password.length < 8) {
                errors.new_password = "La contraseña debe tener al menos 8 caracteres.";
            } else if (!/[A-Z]/.test(passwordData.new_password)) {
                errors.new_password = "La contraseña debe contener al menos una letra mayúscula.";
            } else if (!/[a-z]/.test(passwordData.new_password)) {
                errors.new_password = "La contraseña debe contener al menos una letra minúscula.";
            } else if (!/\d/.test(passwordData.new_password)) {
                errors.new_password = "La contraseña debe contener al menos un número.";
            }
        }
        if (!passwordData.confirm_password) {
            errors.confirm_password = "Debes confirmar la nueva contraseña.";
        } else if (passwordData.new_password !== passwordData.confirm_password) {
            errors.confirm_password = "Las contraseñas no coinciden.";
        }
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmittingData(true);
        try {
            const response = await api.patch('/profile/', formData);
            setUserData({ ...userData, ...response.data.data });
            setIsEditing(false);
            setFormErrors({});
            setModalMessage('Perfil actualizado correctamente.');
            setShowSuccessModal(true);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Error al actualizar el perfil.';
            setFormErrors({ general: errorMsg });
        } finally {
            setIsSubmittingData(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            document_number: userData.document_number || '',
            nombre_completo: userData.nombre_completo || '',
            direccion: userData.direccion || '',
            telefono: userData.telefono || '',
            correo: userData.correo || ''
        });
        setFormErrors({});
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsSubmittingPassword(true);
        try {
            await api.post('/profile/', passwordData);
            setIsChangingPassword(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setPasswordErrors({});
            setModalMessage('Tu contraseña ha sido actualizada correctamente.');
            setShowSuccessModal(true);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Error al cambiar la contraseña.';
            setPasswordErrors({ general: errorMsg });
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        setModalMessage('');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No se encontraron datos</div>;

    const isClient = userData.rol === "cliente";

    return (
        <div className="profile-page">
            <div className={`profile-container ${isClient ? 'client-view' : 'non-client-view'}`}>
                <h2>{isClient ? 'Tu Información' : `Información del ${userData.rol === 'admin' ? 'Administrador' : 'Vendedor'}`}</h2>
                <div className="profile-details">
                    <div className="form-group">
                        <label>N° de Documento:</label>
                        <input
                            type="text"
                            name="document_number"
                            value={formData.document_number}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmittingData}
                            className={formErrors.document_number ? 'input-error' : ''}
                        />
                        {formErrors.document_number && <span className="error">{formErrors.document_number}</span>}
                    </div>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={formData.nombre_completo}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmittingData}
                            className={formErrors.nombre_completo ? 'input-error' : ''}
                        />
                        {formErrors.nombre_completo && <span className="error">{formErrors.nombre_completo}</span>}
                    </div>
                    <div className="form-group">
                        <label>Correo Electrónico:</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmittingData}
                            className={formErrors.correo ? 'input-error' : ''}
                        />
                        {formErrors.correo && <span className="error">{formErrors.correo}</span>}
                    </div>
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmittingData}
                            className={formErrors.telefono ? 'input-error' : ''}
                        />
                        {formErrors.telefono && <span className="error">{formErrors.telefono}</span>}
                    </div>
                    <div className="form-group">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSubmittingData}
                        />
                    </div>
                    {formErrors.general && <div className="error general-error">{formErrors.general}</div>}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                                disabled={isSubmittingData}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={handleSubmit}
                                disabled={isSubmittingData}
                            >
                                {isSubmittingData ? 'Cargando...' : 'Guardar Cambios'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleGoBack}
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={handleEditClick}
                            >
                                Editar Información
                            </button>
                        </>
                    )}
                </div>

                {!isEditing && (
                    <div className="profile-actions">
                        <button
                            type="button"
                            className="edit-btn"
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                        >
                            {isChangingPassword ? 'Cancelar Cambio de Contraseña' : 'Cambiar Contraseña'}
                        </button>
                    </div>
                )}

                {isChangingPassword && (
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                        <div className="form-group">
                            <label>Contraseña Actual:</label>
                            <div className="password-input-container">
                                <input
                                    type={passwordVisibility.current_password ? 'text' : 'password'}
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className={passwordErrors.current_password ? 'input-error' : ''}
                                    disabled={isSubmittingPassword}
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('current_password')}
                                    aria-label={passwordVisibility.current_password ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <i className={passwordVisibility.current_password ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </span>
                            </div>
                            {passwordErrors.current_password && <span className="error">{passwordErrors.current_password}</span>}
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña:</label>
                            <div className="password-input-container">
                                <input
                                    type={passwordVisibility.new_password ? 'text' : 'password'}
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    className={passwordErrors.new_password ? 'input-error' : ''}
                                    disabled={isSubmittingPassword}
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('new_password')}
                                    aria-label={passwordVisibility.new_password ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <i className={passwordVisibility.new_password ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </span>
                            </div>
                            {passwordErrors.new_password && <span className="error">{passwordErrors.new_password}</span>}
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nueva Contraseña:</label>
                            <div className="password-input-container">
                                <input
                                    type={passwordVisibility.confirm_password ? 'text' : 'password'}
                                    name="confirm_password"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    className={passwordErrors.confirm_password ? 'input-error' : ''}
                                    disabled={isSubmittingPassword}
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('confirm_password')}
                                    aria-label={passwordVisibility.confirm_password ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <i className={passwordVisibility.confirm_password ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </span>
                            </div>
                            {passwordErrors.confirm_password && <span className="error">{passwordErrors.confirm_password}</span>}
                        </div>
                        {passwordErrors.general && <div className="error general-error">{passwordErrors.general}</div>}
                        <div className="profile-actions">
                            <button
                                type="submit"
                                className="edit-btn"
                                disabled={isSubmittingPassword}
                            >
                                {isSubmittingPassword ? 'Cargando...' : 'Guardar Nueva Contraseña'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {isClient && userData.orders && userData.orders.length > 0 && (
                <div className="orders-section">
                    <h3>Tus Pedidos</h3>
                    <div className="orders-list">
                        {userData.orders
                            .filter(order => !['pendiente', 'rechazado'].includes(order.status))
                            .map(order => {
                                console.log('Estado del pedido:', order.status);
                                return (
                                    <div key={order.id} className="order-item">
                                        <span className="order-date">
                                            {new Date(order.order_date).toLocaleDateString('es-CO')}
                                        </span>
                                        <span className="order-name">
                                            {order.items.map(item => item.producto.nombre).join(', ')}
                                        </span>
                                        <span className="order-total">
                                            ${parseFloat(order.total_amount).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                        <span className={`order-status ${order.status}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                        <div className="order-actions">
                                            <Link to={`/cliente/pedidos/${order.id}`} className="btn btn-details">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>¡Éxito!</h3>
                        <p>Perfil actualizado correctamente.</p>
                        <button className="modal-close-btn" onClick={closeModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;