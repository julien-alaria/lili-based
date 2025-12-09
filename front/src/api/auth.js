import instance from "./config";
import axios from "axios"
//Fonctions pour appeler le backend (login, register...)

async function signIn(data) {
    return await instance.post("/api/auth/login", data)

}

async function login(data) {
    const res = await instance.post("/api/auth/login", data);
    // Stocke le token dans localStorage si succès
    if(res.data.accessToken){
        localStorage.setItem("accessToken", res.data.accessToken);
    }
    return res.data;
}

async function register(data) {
    return await instance.post("/api/auth/register", data);
}

async function getAuthenticated() {
    return await instance.get("/authenticated");
}

async function listUsersExample() {
    // try {
    //     const response = await axios.get("https://jsonplaceholder.typicode.com/users")
    //     return response.data
    // } catch (error) {
    //     return error
    // }

  try {
    const response = await instance.get("/api/users"); // utilise instance pour la cohérence
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }

}

export { signIn, login, register, getAuthenticated, listUsersExample }