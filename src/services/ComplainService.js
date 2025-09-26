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
        // console.log(resp, "response")
        responseData = resp
      })
  })
  return responseData
}

const addAction = async (data) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/complainActions", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while adding complain action';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};

const editAction = async (formData) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const id = formData.get('id');
    const response =  await apiInstance.post(`/api/complainActions/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while editing complain action';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};

const deleteComplain = async (id) => {
  let authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/complainActions/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // result = response.data;
  } catch (error) {
    let errorMessage = 'An error occurred while deleting complain';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    throw new Error(errorMessage);
  }
};

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
  addAction,
  editAction,
  deleteComplain,
  getSanctum,
  getCount,
}

export default ComplainService
