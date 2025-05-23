const userService = require("../services/userService");

module.exports = {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await userService.login(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(err.status || 401).json({ error: err.message });
    }
  },
};
