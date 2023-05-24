import axios, { AxiosInstance } from "axios";

export const getAxiosBackend = (accessToken: string) : AxiosInstance => {
  let springBootUrl = "http://localhost:8080/api/v1";

  if(process.env.NEXT_PUBLIC_PROD){
      springBootUrl = process.env.NEXT_PUBLIC_SPRING_BOOT_URL;
  }

  return axios.create({
    baseURL: springBootUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export const geoCodingApi:AxiosInstance =axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/geocode/"
})

export const openAiApi: AxiosInstance = axios.create({
  baseURL: "https://api.openai.com",
  headers:{
    Authorization: 'Bearer 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',
    'Content-Type': 'application/json'
  }
})