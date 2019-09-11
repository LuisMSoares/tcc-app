import { AsyncStorage } from 'react-native';
import axios from 'axios';

export const baseURL = 'http://192.168.0.100:5000/api'

const api = axios.create({
  baseURL: baseURL,
  validateStatus: function (status) {
    return status < 1000;
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@MyAppJWT:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (err) {
    alert(err);
  }
});

export default api;

