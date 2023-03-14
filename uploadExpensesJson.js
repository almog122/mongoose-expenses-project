const mongoose = require("mongoose");
const Expense = require("./server/model/ExpenseModel");
const moment = require("moment");
const ExpenseData = require("./data/expenses.json");

mongoose.connect("mongodb://127.0.0.1:27017/mongoose-expenses");

//Run only once!

for (let expense of ExpenseData) {
  let exp = new Expense({
    item: expense.item,
    amount: expense.amount,
    date: moment(new Date(expense.date)).format("YYYY-MM-DD"),
    group: expense.group,
  });

  exp.save();
}
