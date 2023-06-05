


import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    const axiosSecure = axios.create({
        baseURL: 'http://localhost:5000',
    });

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logOut()
                        .then(() => {
                            navigate('/login');
                        })
                        .catch((logoutError) => {
                            console.error('Logout error:', logoutError);
                        });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Cleanup interceptors on component unmount
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate, axiosSecure]);

    return [axiosSecure];
};

export default useAxiosSecure;
