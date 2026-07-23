const { ExpenseModel, CATEGORIES, PAYMENT_METHODS } = require("../models/expenseModel");

const expenseController = {
  async getAll(req, res, next) {
    try {
      const {
        search, category, payment_method, sort,
        page, limit, startDate, endDate, minAmount, maxAmount,
      } = req.query;
      const data = await ExpenseModel.findAll({
        search, category, payment_method, sort,
        page, limit, startDate, endDate, minAmount, maxAmount,
      });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const expense = await ExpenseModel.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }
      res.json({ success: true, expense });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, amount, category, payment_method, expense_date, notes } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
      }
      if (!category || !CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: "Valid category is required" });
      }
      if (!payment_method || !PAYMENT_METHODS.includes(payment_method)) {
        return res.status(400).json({ success: false, message: "Valid payment method is required" });
      }
      if (!expense_date) {
        return res.status(400).json({ success: false, message: "Date is required" });
      }

      const expense = await ExpenseModel.create({
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        payment_method,
        expense_date,
        notes: notes || "",
      });
      res.status(201).json({ success: true, expense });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const existing = await ExpenseModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }

      const { title, amount, category, payment_method, expense_date, notes } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
      }
      if (!category || !CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: "Valid category is required" });
      }
      if (!payment_method || !PAYMENT_METHODS.includes(payment_method)) {
        return res.status(400).json({ success: false, message: "Valid payment method is required" });
      }
      if (!expense_date) {
        return res.status(400).json({ success: false, message: "Date is required" });
      }

      const expense = await ExpenseModel.update(req.params.id, {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        payment_method,
        expense_date,
        notes: notes || "",
      });
      res.json({ success: true, expense });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await ExpenseModel.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }
      res.json({ success: true, message: "Expense deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  async getAnalytics(req, res, next) {
    try {
      const analytics = await ExpenseModel.getAnalytics();
      res.json({ success: true, analytics });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = expenseController;
