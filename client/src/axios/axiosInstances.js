import axios from "axios";

const axiosInstance = axios.create(
  {
    baseURL: "http://localhost:3000",
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const getAxiosInstance = () => axios.create(
  {
    baseURL: "http://localhost:3000",
    headers: {
      'Content-Type': 'application/json',
    },
  })

export default axiosInstance
