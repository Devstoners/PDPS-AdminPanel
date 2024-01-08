import { get, post } from "../helpers/api_helper"
import axios from "axios"

const register = async (data) => {

  let some
  const response = await get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(async response => {
   await axios.post("http://127.0.0.1:8000/api/activate", data).then(res => {
      console.log(res)
      some = res
    }).catch(error => {
      some = error
    })
  })
  return some
}

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const RegisterService = {
  register,
  getSanctum,
}

export default RegisterService
