const { Transaction, User } = require("../models");
const xlsx = require("xlsx");
const { Op } = require("sequelize");

module.exports = {

  async create(
    userId,
    { description, value, points, status, transactionDate }
  ) {
    if (!userId || !value) throw new Error("Dados obrigatórios ausentes");

    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const normalizedStatus = (status || "Em avaliação").toLowerCase().trim();

    const ptsString = String(points).replace(/\./g, "").replace(",", ".");
    const pts = Number(ptsString) || 0;

    const transaction = await Transaction.create({
      userId,
      description,
      transactionDate: transactionDate || new Date(),
      points: pts,
      value,
      status: normalizedStatus,
    });

    await this.recalculateUserBalance(userId);

    return {
      message: "Transação criada com sucesso!",
      transaction,
    };
  },

  async getAll({
    isAdmin,
    userId,
    cpf,
    description,
    dateFrom,
    dateTo,
    minValue,
    maxValue,
    status,
  }) {
    const where = {};

    if (!isAdmin) {
      where.userId = userId;
    }

    if (description) {
      where.description = { [Op.like]: `%${description}%` };
    }
    if (status) {
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.transactionDate = {};
      if (dateFrom) where.transactionDate[Op.gte] = dateFrom;
      if (dateTo) where.transactionDate[Op.lte] = dateTo;
    }
    if (minValue || maxValue) {
      where.value = {};
      if (minValue) where.value[Op.gte] = minValue;
      if (maxValue) where.value[Op.lte] = maxValue;
    }

    const include = [
      {
        model: User,
        as: "user",
        attributes: ["cpf"],
        ...(isAdmin && cpf ? { where: { cpf } } : {}),
      },
    ];

    const transactions = await Transaction.findAll({
      where,
      include,
      order: [["transactionDate", "DESC"]],
    });

    return transactions.map((transaction) => {
      const data = transaction.toJSON();
      data.cpf = data.user?.cpf || null;
      return data;
    });
  },

  async recalculateUserBalance(userId) {
    const totalPoints = await Transaction.sum("points", {
      where: { userId, status: "aprovado" },
    });

    const user = await User.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    user.balance = totalPoints || 0;
    await user.save();
  },

  async processUpload(buffer) {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const results = [];

    for (const row of rows) {
      const cpfRaw = row["CPF"];
      const description = row["Descrição da transação"];
      const dateStr = row["Data da transação"];
      const points = Number(row["Valor em pontos"]);
      const value = Number(row["Valor"]);
      const status = row["Status"];

      if (!cpfRaw || !value) {
        results.push({ row, error: "CPF ou valor ausente" });
        continue;
      }

      const cpf = cpfRaw.replace(/\D/g, "");

      const user = await User.findOne({ where: { cpf } });
      if (!user) {
        results.push({ row, error: "Usuário com CPF não encontrado" });
        continue;
      }

      let transactionDate = new Date();
      if (dateStr) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          transactionDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      }

      try {
        const transaction = await this.create(user.id, {
          description,
          value,
          points,
          status,
          transactionDate,
        });

        results.push({ row, transaction, error: null });
      } catch (error) {
        results.push({ row, error: error.message });
      }
    }

    return { message: "Processamento finalizado", results };
  },
};
