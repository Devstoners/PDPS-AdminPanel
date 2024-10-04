import { get, post } from "../helpers/api_helper"
import axios from "axios"
const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

// --------------------------- Officer -----------------------------
const addOfficer = async (data) => {

  for (const entry of data.entries()) {
    console.log(entry[0], entry[1]);
  }
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/officer", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while adding officer';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};

const getOfficer = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/officer", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching officer:", error);
    result = error;
  }
  return result;
};


const editOfficer = async (formData) => {
  for (const entry of formData.entries()) {
    console.log(entry[0], entry[1]);
  }
  const id = formData.get('id');
  console.log('Form Data ID:', id);
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.post(`/api/officer/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return { result: response.data, errorMessage: '' };
  } catch (error) {
    let errorMessage = 'An error occurred while editing officer';
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;
      errorMessage = Object.values(validationErrors).join('\n');
    }
    return { result: null, errorMessage };
  }
};


const deleteOfficer = async (officerId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/officer/${officerId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error deleting officer:", error);
    result = error;
  }
  return result;
};

const  countOfficer = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/countOfficer", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching officer count:", error);
    result = error;
  }
  return result;
};

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

const editPosition = async (formData) => {
  const authToken = localStorage.getItem("auth-token");
  // console.log("This is the id bro : ", formData.id)
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const id = formData.get('id');
    const response =  await apiInstance.post(`/api/officerPosition/${id}`, formData, {
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
    // console.log(result)
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


// --------------------------- Duty -----------------------------
const addDuty = async (data) => {
  const authToken = localStorage.getItem("auth-token");
  // for (const entry of data.entries()) {
  //   console.log(entry[0], entry[1]);
  // }
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

const editDuty = async (formData) => {
  const authToken = localStorage.getItem("auth-token");
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const id = formData.get('id');
    const response =  await apiInstance.post(`/api/officerSubject/${id}`, formData, {
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


const getDuty = async () => {
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
    // console.log(result)
  } catch (error) {
    console.error("Error fetching subject:", error);
    result = error;
  }
  return result;
};

const deleteDuty = async (subjectId) => {
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

// --------------------------- Service -----------------------------
const getService = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/officerServices", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching services:", error);
    result = error;
  }
  return result;
};

// --------------------------- Grade -----------------------------
const getGradesByService = async (serviceId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get(`/api/officerGrades/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log("Grades from API:", result);
  } catch (error) {
    console.error("Error fetching grades:", error);
    result = error;
  }
  return result;
};

// --------------------------- Position -----------------------------
const getPositionsByGrade = async (serviceId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get(`/api/officerPositions/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching positions:", error);
    result = error;
  }
  return result;
};

// --------------------------- Duty -----------------------------
const getDutiesByPosition = async (positionId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get(`/api/officerDuties/${positionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching duties:", error);
    result = error;
  }
  return result;
};

// --------------------------- Level -----------------------------
const getLevel = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/officerLevels", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching services:", error);
    result = error;
  }
  return result;
};


const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const OfficerService = {
  getSanctum,
  
  getOfficer,
  addOfficer,
  editOfficer,
  deleteOfficer,
  countOfficer,

  addDuty,
  getDuty,
  deleteDuty,
  editDuty,

  addPosition,
  getPosition,
  deletePosition,
  editPosition,

  getService,
  getGradesByService,
  getPositionsByGrade,
  getDutiesByPosition,
  getLevel,



}


export default OfficerService
