const transactionService = require("../services/transactionService");

module.exports = {
  async create(req, res) {
    try {
      const result = await transactionService.create(req.userId, req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const isAdmin = req.userRole === "admin";

      const filters = {
        isAdmin,
        userId: req.userId,
        cpf: req.query.cpf,
        description: req.query.description,
        dateFrom: req.query.dateFrom && new Date(req.query.dateFrom),
        dateTo: req.query.dateTo && new Date(req.query.dateTo),
        minValue: req.query.minValue && Number(req.query.minValue),
        maxValue: req.query.maxValue && Number(req.query.maxValue),
        status: req.query.status,
      };

      console.log(filters);

      const transactions = await transactionService.getAll(filters);
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Arquivo não enviado" });
      }

      const result = await transactionService.processUpload(req.file.buffer);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
