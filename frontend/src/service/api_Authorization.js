import axios from "axios";

const api = function (Token) {
    
  if (  Token == "" || Token == null) {
    return axios.create({
      baseURL: "",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: "",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
  }
};

export default api;
