import { get, post } from "../helpers/api_helper"
import axios from "axios"
import { useState } from "react"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  "Content-Type": "multipart/form-data",
})


// --------------------------- Album -----------------------------
const addGallery = async data => {
  const authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.post("/api/gallery", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return { result: response.data, errorMessage: "" }
  } catch (error) {
    let errorMessage = "An error occurred while adding gallery"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

const editGallery = async formData => {
  const authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const id = formData.get('id');
    const response =  await apiInstance.post(`/api/gallery/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = "An error occurred while editing gallery"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

const getGallery = async () => {
  let authToken = localStorage.getItem("auth-token")
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.get("/api/gallery", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    result = response.data
  } catch (error) {
    console.error("Error fetching gallery:", error)
    result = error
  }
  return result
}

const deleteGallery = async galleryId => {
  let authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.delete(`/api/gallery/${galleryId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    // result = response.data;
  } catch (error) {
    let errorMessage = "An error occurred while deleting gallery"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    throw new Error(errorMessage)
  }
}

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const GalleryService = {
  getSanctum,

  addGallery,
  getGallery,
  deleteGallery,
  editGallery,
}

export default GalleryService
