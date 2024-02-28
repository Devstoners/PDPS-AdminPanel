import { get, post } from "../helpers/api_helper"
import axios from "axios"
import Swal from "sweetalert2"
import { useState } from "react"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});



const getOffers = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/officer", {
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

const subject = async (data) => {
  //console.log("test4")
  let some
  const response = await get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async response => {
    await axios.post("http://127.0.0.1:8000/api/addSubject", data).then(res => {
      console.log(res)
      some = res
    }).catch(error => {
      some = error
    })
  })
  return some
}

// --------------------------- Position -----------------------------
const addPosition = async (data) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/officerPosition", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while adding position';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};

const editPosition = async (updatePosition) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/officerPosition/${updatePosition.id}`, updatePosition, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while editing position';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};


const getPosition = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/officerPosition", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching position:", error);
    result = error;
  }
  return result;
};

const deletePosition = async (positionId) => {
  let authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/officerPosition/${positionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // result = response.data;
  } catch (error) {
    let errorMessage = 'An error occurred while deleting position';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    throw new Error(errorMessage);
  }
};


// --------------------------- Subject -----------------------------
const addSubject = async (data) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/officerSubject", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while adding subject';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};

const editSubject = async (updateSubject) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/officerSubject/${updateSubject.id}`, updateSubject, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while editing subject';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};


const getSubject = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/officerSubject", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching subject:", error);
    result = error;
  }
  return result;
};

const deleteSubject = async (subjectId) => {
  let authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/officerSubject/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // result = response.data;
  } catch (error) {
    let errorMessage = 'An error occurred while deleting subject';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    throw new Error(errorMessage);
  }
};

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const OfficerService = {
  getSanctum,

  addSubject,
  getSubject,
  deleteSubject,
  editSubject,

  addPosition,
  getPosition,
  deletePosition,
  editPosition,

  getOffers,
}


export default OfficerService
