import { get, post } from "../helpers/api_helper"
import axios from "axios";

const login = async (data) => {
    let some;
    const response = await get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async response => {
        console.log('test');
        await axios.post("http://127.0.0.1:8000/api/login", data).then(res => {
            console.log(res);
            some = res;
        }).catch(error => {
            some = error;
        });


    })
    return some;

};

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

const getSanctum= () => get("http://127.0.0.1:8000/sanctum/csrf-cookie");
const LoginService = {
    login,
    getSanctum
}

export default LoginService
