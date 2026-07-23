const { pool } = require("../db");

const CATEGORIES = [
  "Food", "Travel", "Shopping", "Bills",
  "Entertainment", "Education", "Health", "Other",
];

const PAYMENT_METHODS = [
  "Cash", "UPI", "Credit Card", "Debit Card",
  "Net Banking", "Wallet",
];

const ExpenseModel = {
  async findAll({ search, category, payment_method, sort, page, limit, startDate, endDate, minAmount, maxAmount }) {
    const conditions = [];
    const params = [];
    let idx = 1;

    if (search) {
      conditions.push(`(LOWER(title) LIKE LOWER($${idx}) OR LOWER(category) LIKE LOWER($${idx}))`);
      params.push(`%${search}%`);
      idx++;
    }
    if (category) {
      conditions.push(`category = $${idx}`);
      params.push(category);
      idx++;
    }
    if (payment_method) {
      conditions.push(`payment_method = $${idx}`);
      params.push(payment_method);
      idx++;
    }
    if (startDate) {
      conditions.push(`expense_date >= $${idx}`);
      params.push(startDate);
      idx++;
    }
    if (endDate) {
      conditions.push(`expense_date <= $${idx}`);
      params.push(endDate);
      idx++;
    }
    if (minAmount) {
      conditions.push(`amount >= $${idx}`);
      params.push(parseFloat(minAmount));
      idx++;
    }
    if (maxAmount) {
      conditions.push(`amount <= $${idx}`);
      params.push(parseFloat(maxAmount));
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sortMap = {
      latest: "expense_date DESC, created_at DESC",
      oldest: "expense_date ASC, created_at ASC",
      highest: "amount DESC",
      lowest: "amount ASC",
      "a-z": "title ASC",
      "z-a": "title DESC",
    };
    const orderBy = sortMap[sort] || "expense_date DESC, created_at DESC";

    const currentPage = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 10), 100);
    const offset = (currentPage - 1) * limitNum;

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM expenses ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM expenses ${where} ORDER BY ${orderBy} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limitNum, offset]
    );

    return {
      expenses: result.rows,
      pagination: {
        total,
        page: currentPage,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  async findById(id) {
    const result = await pool.query("SELECT * FROM expenses WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async create({ title, amount, category, payment_method, expense_date, notes }) {
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, payment_method, expense_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, amount, category, payment_method, expense_date, notes || ""]
    );
    return result.rows[0];
  },

  async update(id, { title, amount, category, payment_method, expense_date, notes }) {
    const result = await pool.query(
      `UPDATE expenses
       SET title = $1, amount = $2, category = $3, payment_method = $4,
           expense_date = $5, notes = $6
       WHERE id = $7 RETURNING *`,
      [title, amount, category, payment_method, expense_date, notes || "", id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0] || null;
  },

  async getAnalytics() {
    const totalExpenses = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM expenses");
    const todayExpenses = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE expense_date = CURRENT_DATE"
    );
    const monthlyExpenses = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses
       WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)`
    );
    const count = await pool.query("SELECT COUNT(*) as count FROM expenses");
    const avgExpense = await pool.query("SELECT COALESCE(AVG(amount), 0) as avg FROM expenses");

    const categoryBreakdown = await pool.query(
      `SELECT category, COUNT(*) as count, SUM(amount) as total
       FROM expenses GROUP BY category ORDER BY total DESC`
    );

    const monthlyTrend = await pool.query(
      `SELECT TO_CHAR(DATE_TRUNC('month', expense_date), 'Mon') as month,
              EXTRACT(YEAR FROM expense_date) as year,
              SUM(amount) as total
       FROM expenses
       GROUP BY DATE_TRUNC('month', expense_date), EXTRACT(YEAR FROM expense_date)
       ORDER BY MIN(expense_date) ASC
       LIMIT 12`
    );

    const recentActivity = await pool.query(
      `SELECT * FROM expenses ORDER BY created_at DESC LIMIT 10`
    );

    const topCategories = await pool.query(
      `SELECT category, SUM(amount) as total
       FROM expenses GROUP BY category ORDER BY total DESC LIMIT 5`
    );

    const paymentMethodBreakdown = await pool.query(
      `SELECT payment_method, COUNT(*) as count, SUM(amount) as total
       FROM expenses GROUP BY payment_method ORDER BY total DESC`
    );

    const dailyTrend = await pool.query(
      `SELECT expense_date, SUM(amount) as total
       FROM expenses
       WHERE expense_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY expense_date ORDER BY expense_date ASC`
    );

    return {
      totalExpenses: parseFloat(totalExpenses.rows[0].total),
      todayExpenses: parseFloat(todayExpenses.rows[0].total),
      monthlyExpenses: parseFloat(monthlyExpenses.rows[0].total),
      totalTransactions: parseInt(count.rows[0].count),
      averageExpense: parseFloat(avgExpense.rows[0].avg),
      categoryBreakdown: categoryBreakdown.rows,
      monthlyTrend: monthlyTrend.rows,
      recentActivity: recentActivity.rows,
      topCategories: topCategories.rows,
      paymentMethodBreakdown: paymentMethodBreakdown.rows,
      dailyTrend: dailyTrend.rows,
    };
  },
};

module.exports = { ExpenseModel, CATEGORIES, PAYMENT_METHODS };
