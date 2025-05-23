import { Button } from "../../components/button/Button";
import { AdminDashboard } from "../AdminDashboard";
import { UserDashboard } from "../UserDashboard";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export const Home = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const navigate = useNavigate();

  if (!user) {
    return <div>Carregando...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoutContainer}>
              <Button variant="outline" size="small" onClick={handleLogout}>Sair</Button>
      </div>
      {user.role === "admin" ? <AdminDashboard /> : <UserDashboard />};
    </div>
  );
};
