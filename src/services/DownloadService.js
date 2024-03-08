import { get, post } from "../helpers/api_helper"
import axios from "axios"
import { useState } from "react"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  "Content-Type": "multipart/form-data",
})

// --------------------------- Acts -----------------------------
const addActs = async data => {
  // console.log("form data : ", data)
  const authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.post("/api/downloadActs", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return { result: response.data, errorMessage: "" }
  } catch (error) {
    let errorMessage = "An error occurred while adding acts"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

const editActs = async data => {
  const authToken = localStorage.getItem("auth-token")

  // Create a custom Axios instance with FormData and set headers

  try {
    // Fetch CSRF token
    await apiInstance.get("/sanctum/csrf-cookie")
    let actId = data.get("id")
    console.log("xyz", actId)
    // Make PUT request with custom Axios instance
    const response = await apiInstance.put(`/api/downloadActs/${actId}`, data)

    return { result: response.data, errorMessage: "" }
  } catch (error) {
    let errorMessage = "An error occurred while editing acts"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

// const editActs = async (formData) => {
//   let authToken = localStorage.getItem("auth-token");
//   let actId;
//   formData.forEach((value, key) => {
//     if (key === "id") {
//       actId = value;
//     }
//   });
//   let result
//   try {
//     await apiInstance.get("/sanctum/csrf-cookie");
//     const response = await apiInstance.put(`/api/downloadActs/${actId}`, formData, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     result = response.data
//   } catch (error) {
//     let errorMessage = 'An error occurred while editing acts';
//
//     // Check if there are specific validation errors
//     if (error.response && error.response.data && error.response.data.errors) {
//       const validationErrors = error.response.data.errors;
//       errorMessage = Object.values(validationErrors).join('\n');
//     }
//
//     return { result: null, errorMessage };
//   }
// };

const getActs = async () => {
  let authToken = localStorage.getItem("auth-token")
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.get("/api/downloadActs", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    result = response.data
  } catch (error) {
    console.error("Error fetching acts:", error)
    result = error
  }
  return result
}

const deleteActs = async actsId => {
  let authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.delete(`/api/downloadActs/${actsId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    // result = response.data;
  } catch (error) {
    let errorMessage = "An error occurred while deleting acts"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    throw new Error(errorMessage)
  }
}

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const DownloadService = {
  getSanctum,

  addActs,
  getActs,
  deleteActs,
  editActs,
}

export default DownloadService
