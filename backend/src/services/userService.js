const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async register({ name, email, password, cpf }) {
    if (!name || !email || !password) {
      throw new Error("Nome, e-mail e senha são obrigatórios");
    }

    if (password.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      balance: 0,
    });

    return {
      message: "Usuário cadastrado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    };
  },

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });

    const isValidPassword =
      user && (await bcrypt.compare(password, user.password));
    if (!user || !isValidPassword) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    };
  },
};
