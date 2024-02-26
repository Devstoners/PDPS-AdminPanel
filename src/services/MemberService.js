import { get, post } from "../helpers/api_helper"
import axios from "axios"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

// --------------------------- Member -----------------------------
const addMember = async (data) => {
  console.log("form data", data);
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/member", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error adding member:", error);
    result = error;
  }
  return result;
};

const getMember = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/member", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
    // console.log(result)
  } catch (error) {
    console.error("Error fetching member:", error);
    result = error;
  }
  return result;
};

const deleteMember = async (memberId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error deleting member:", error);
    result = error;
  }
  return result;
};

// --------------------------- Division -----------------------------
const addDivision = async (data) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/memberDivision", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error adding division:", error);
    result = error;
  }
  return result;
};

const getDivision = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/memberDivision", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching division:", error);
    result = error;
  }
  return result;
};

const deleteDivision = async (divisionId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/memberDivision/${divisionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error deleting division:", error);
    result = error;
  }
  return result;
};

const editDivision = async (updateDivision) => {
  console.log(updateDivision)
  let authToken = localStorage.getItem("auth-token");
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/memberParty/${updateDivision.id}`, updateDivision, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data
  } catch (error) {
    console.error("Error editing party:", error);
    result = error
  }
  return result
};

// --------------------------- Party -----------------------------
const addParty = async (data) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/memberParty", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error adding party:", error);
    result = error;
  }
  return result;
};

const getParty = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/memberParty", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching party:", error);
    result = error;
  }
  return result;
};

const deleteParty = async (divisionId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/memberParty/${divisionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error deleting party:", error);
    result = error;
  }
  return result;
};

const editParty = async (updateParty) => {
  console.log(updateParty)
  let authToken = localStorage.getItem("auth-token");
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/memberParty/${updateParty.id}`, updateParty, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data
  } catch (error) {
    console.error("Error editing division:", error);
    result = error
  }
  return result
};

// --------------------------- Position -----------------------------
const addPosition = async (data) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/memberPosition", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error adding position:", error);
    result = error;
  }
  return result;
};

const getPosition = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/memberPosition", {
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
    const response =  await apiInstance.delete(`/api/memberPosition/${positionId}`, {
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
    const response =  await apiInstance.put(`/api/memberPosition/${updatePosition.id}`, updatePosition, {
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
const MemberService = {
  addMember,
  getMember,
  deleteMember,

  addDivision,
  getDivision,
  deleteDivision,
  editDivision,

  addParty,
  getParty,
  deleteParty,
  editParty,

  addPosition,
  getPosition,
  deletePosition,
  editPosition,
}

export default MemberService