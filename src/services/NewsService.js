import { get, post } from "../helpers/api_helper"
import axios from "axios"

const apiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});
const getNews = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/news", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    result = error;
  }
  return result;
};
const addNews = async (data) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.post("/api/news", data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error adding news:", error);
    result = error;
  }
  return result;
};

const editNews = async (updatedNews) => {
  console.log(updatedNews)
  let authToken = localStorage.getItem("auth-token");
  let result
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.put(`/api/news/${updatedNews.id}`, updatedNews, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data
  } catch (error) {
    console.error("Error editing news:", error);
    result = error
  }
  return result
};

const deleteNews = async (newsId) => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response =  await apiInstance.delete(`/api/news/${newsId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error Deleting News:", error);
    result = error;
  }
  return result;
};
// test

const  newsCount = async () => {
  let authToken = localStorage.getItem("auth-token");
  let result;
  try {
    await apiInstance.get("/sanctum/csrf-cookie");
    const response = await apiInstance.get("/api/newscount", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    result = response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    result = error;
  }
  return result;
};



const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const NewsService = {
  addNews,
  editNews,
  getSanctum,
  getNews,
  deleteNews,
  newsCount,
}

export default NewsService
