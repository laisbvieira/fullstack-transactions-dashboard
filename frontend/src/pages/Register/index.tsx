import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../../services/registerService";
import { loginUser } from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../../components/button/Button";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export const Register = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data);
      setMessage("Cadastro realizado com sucesso! Fazendo login...");

      const { token, user } = await loginUser({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      reset();
      navigate("/home");
    } catch (error: any) {
      setMessage("Erro: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Cadastro</h2>
        <p>Realize seu cadastro pra ter acesso a nossa plataforma</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Digite seu nome"
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

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

          <Button size="small" type="submit" className={styles.submitBtn}>
            Cadastrar
          </Button>
        </form>

        <div className={styles.loginPrompt}>
          <p>
            Já possui conta? <a href="/login">Faça o Login</a>
          </p>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};
