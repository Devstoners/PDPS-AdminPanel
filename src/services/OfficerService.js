import { get, post } from "../helpers/api_helper"
import axios from "axios"
import Swal from "sweetalert2"
import { useState } from "react"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

const position = async (data) => {
  //console.log("test4")
  let some
  const response = await get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async response => {
   await axios.post("http://127.0.0.1:8000/api/addPosition", data).then(res => {
      console.log(res)
      some = res
    }).catch(error => {
      some = error
    })
  })
  return some
}

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
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/officerPosition/${positionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error deleting position:", error);
    result = error;
  }
  return result;
};

const editPosition = async (updatePosition) => {
  console.log(updatePosition)
  let authToken = localStorage.getItem("auth-token");
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/officerPosition/${updatePosition.id}`, updatePosition, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data
  } catch (error) {
    console.error("Error editing position:", error);
    result = error
  }
  return result
};

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const OfficerService = {
  subject,
  position,
  getSanctum,
  getOffers,

  addPosition,
  getPosition,
  deletePosition,
  editPosition,
}


export default OfficerService
