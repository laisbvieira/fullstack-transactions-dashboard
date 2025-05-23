import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../../components/button/Button";

const schema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .required("Senha é obrigatória"),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const { token, user } = await loginUser(data);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("Login realizado com sucesso!");
      reset();
      navigate("/home");
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.message || "Erro ao fazer login. Tente novamente.";
      setMessage(errorMessage);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Login</h2>
        <p>Preencha seus dados e acesse a nossa plataforma!</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Digite seu e-mail"
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={styles.showPasswordBtn}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" size="small" className={styles.submitBtn}>
            Entrar
          </Button>
        </form>

        <div className={styles.loginPrompt}>
          <p>
            Não possui conta? <a href="/">Faça o Cadastro</a>
          </p>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};
