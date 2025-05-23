import { baseUrl } from "../pages/AdminDashboard";
import { saveAuthData, User } from "./auth";

interface UserLoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function loginUser(data: UserLoginData): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro no login");
  }

  const responseData: LoginResponse = await response.json();

  saveAuthData(responseData.token, responseData.user);

  return responseData;
}
