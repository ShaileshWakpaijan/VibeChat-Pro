import axios from "axios";

const Axios = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default Axios;
