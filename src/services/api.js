import axios from 'axios';

import { AsyncStorage } from 'react-native';

const api = axios.create({
  //baseURL: 'http://192.168.0.100:5000',
  baseURL: 'https://toki-api.herokuapp.com',
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

