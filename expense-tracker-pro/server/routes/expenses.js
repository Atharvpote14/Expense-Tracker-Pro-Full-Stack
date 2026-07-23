const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.get("/", expenseController.getAll);
router.get("/analytics", expenseController.getAnalytics);
router.get("/:id", expenseController.getById);
router.post("/", expenseController.create);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.delete);

module.exports = router;
