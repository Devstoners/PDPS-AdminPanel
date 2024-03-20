import { get, post } from "../helpers/api_helper"
import axios from "axios"
import { useState } from "react"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  "Content-Type": "multipart/form-data",
})

const addProject = async data => {
  // console.log("form data : ", data)
  const authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.post("/api/project", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    return { result: response.data, errorMessage: "" }
  } catch (error) {
    let errorMessage = "An error occurred while adding project"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

const editProject = async formData => {
  const authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const id = formData.get('id');
    const response =  await apiInstance.post(`/api/project/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = "An error occurred while editing project"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    return { result: null, errorMessage }
  }
}

const getProject = async () => {
  let authToken = localStorage.getItem("auth-token")
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.get("/api/project", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    result = response.data
  } catch (error) {
    console.error("Error fetching project:", error)
    result = error
  }
  return result
}

const deleteProject = async projectId => {
  let authToken = localStorage.getItem("auth-token")
  try {
    await apiInstance.get("/sanctum/csrf-cookie")
    const response = await apiInstance.delete(`/api/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
  } catch (error) {
    let errorMessage = "An error occurred while deleting project"
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors
      errorMessage = Object.values(validationErrors).join("\n")
    }
    throw new Error(errorMessage)
  }
}


const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const ProjectService = {
  getSanctum,

  addProject,
  getProject,
  deleteProject,
  editProject,
}

export default ProjectService
