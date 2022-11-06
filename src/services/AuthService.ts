import axios from "axios";
import { HOST, PORT } from "../config/server";
import { UserModel } from "../models/User";

class AuthService {
  setUserInLocalStorage(data: UserModel) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  async login(username: string, password: string): Promise<UserModel> {
    const response = await axios.post(
      `${HOST}:${PORT}/users/api/auth/login/`,

      {
        username,
        password,
      }
    );
    if (!response.data.token) {
      console.log(response.data, "from auth");
      throw response.data;
      return response.data;
    }
    console.log(response.data);
    this.setUserInLocalStorage(response.data);
    return response.data;
  }

  async register(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): Promise<UserModel> {
    const response = await axios.post(
      `${HOST}:${PORT}/users/api/auth/register/`,

      {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
      }
    );
    if (!response.data.token) {
      console.log(response.data, "from auth");
      throw response.data;
      return response.data;
    }
    console.log(response.data);
    this.setUserInLocalStorage(response.data);
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  }
}

export default new AuthService();
