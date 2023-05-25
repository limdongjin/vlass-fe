import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

class SttService {
  createSession: (userId: string) => Promise<AxiosResponse<any>> = async (userId: string) => {
    // const IGNASR_SERVER = process.env.NEXT_PUBLIC_IGNASR_SERVER
    const IGNASR_SERVER = "http://localhost:8088"
    const apiURL = `${IGNASR_SERVER}/api/speech/createSession`
    let withCredentials = !(IGNASR_SERVER.includes("http://localhost"))
    
    const axiosReqConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 3000, 
      withCredentials: withCredentials
    }

    const formData = new FormData();
    formData.append("userId", userId);

    return await axios.post(apiURL, formData, axiosReqConfig);
  }

  upload: (blob: Blob, uuid: string, userId: string, sessionId: string) => Promise<AxiosResponse<any>> =
      async (blob: Blob, uuid: string, userId: string, sessionId: string) => {
    const IGNASR_SERVER = "http://localhost:8088"
    const uploadApiURL = `${IGNASR_SERVER}/api/speech/uspeech`
    let withCredentials = !(IGNASR_SERVER.includes("http://localhost"))
    // const uploadApiURL = "https://ignasr.limdongjin.com/api/speech/upload"

    const axiosReqConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 3000, 
      withCredentials: withCredentials
    }

    const formData = new FormData();
    formData.append("reqId", uuid);
    formData.append("file", blob, "voice.wav");
    formData.append("label", userId);
    formData.append("userId", userId);
    formData.append("sessionId", sessionId);

    return await axios.post(uploadApiURL, formData, axiosReqConfig);
  };
}

export default new SttService();
