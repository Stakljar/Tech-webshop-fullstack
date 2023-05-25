import axios from "axios";

let axiosInstance = axios.create(
  {
    baseURL: "http://localhost:3000",
    contextType: "application/json"
})

export default axiosInstance
