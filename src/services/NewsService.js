import { get, post } from "../helpers/api_helper"
import axios from "axios";

const addNews = async (data) => {
    let some;
    const response = await get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async response => {
        console.log('test');
        await axios.post("http://127.0.0.1:8000/api/news", data).then(res => {
            console.log(res);
            some = res;
        }).catch(error => {
            some = error;
        });


    })
    return some;

};
const getAllNews = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/news", {
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

const getPosition = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/addPosition", {
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

const getSubject = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/addSubject", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                },
            })
            .then(resp => {
                console.log(resp, "response2")
                responseData = resp
            })
    })
    return responseData
}
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
const newsCount = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/newscount", {
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
// const logout = async () => {
//     let logout;
//     const response = await get("sanctum/csrf-cookie").then(async response => {
//         /* console.log(response.status, 'test')
//         let some = post(url.COMMON_LOGIN,data);
//          console.log(some);
//          return some;*/
//         await axios.post(url.COMMON_LOGIN, data).then(res => {
//             console.log(res);
//             logout = res;
//         }).catch(error => {
//             logout = error;
//         });
//
//
//     })
//     return logout;
// }
const getCount = async () => {
    let responseData
    await localStorage.getItem("auth-token")
    const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async res => {
        await axios
            .get("http://127.0.0.1:8000/api/count", {
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
const getSanctum= () => get("http://127.0.0.1:8000/sanctum/csrf-cookie");
const NewsService = {
    addNews,
    getSanctum,
    getAllNews,
    newsCount,
    getCount,
    getAllcomplain,
    getPosition,
    getSubject

}

export default NewsService
