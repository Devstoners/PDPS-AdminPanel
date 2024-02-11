import { get, post } from "../helpers/api_helper"
import axios from "axios"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});
const getAllcomplain = async () => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
    await axios
      .get("http://127.0.0.1:8000/api/addComplain", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then(resp => {
        console.log(resp, "response")
        responseData = resp
      })
  })
  return responseData
}
const  getCount = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/complaincount", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching complain:", error);
    result = error;
  }
  return result;
};
const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const ComplainService = {
  getAllcomplain,
  getSanctum,
  getCount,
}

export default ComplainService
