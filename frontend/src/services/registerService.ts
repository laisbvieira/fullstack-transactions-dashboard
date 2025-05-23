import { baseUrl } from "../pages/AdminDashboard";

interface UserRegisterData {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: UserRegisterData) {
  const response = await fetch(`${baseUrl}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.error || "Erro no cadastro");
  }

  return response.json();
}
