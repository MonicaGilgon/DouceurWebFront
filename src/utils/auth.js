import api from '../api/axios';

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        return newAccessToken;
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/sign-in';
        throw error;
    }
};