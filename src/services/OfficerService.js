import { get, post } from "../helpers/api_helper"
import axios from "axios"

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

const getSanctum = () => get("http://127.0.0.1:8000/sanctum/csrf-cookie")
const OfficerService = {
  subject,
  position,
  getSanctum,
    getOffers
}

export default OfficerService
