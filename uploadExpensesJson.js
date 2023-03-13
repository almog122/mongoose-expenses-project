let mongoose = require("mongoose");
let moment = require("moment");
let Expense = require("./server/model/ExpenseModel");
let ExpenseData = require("./data/expenses.json");

mongoose.connect("mongodb://127.0.0.1:27017/mongoose-expenses");

//Run only once!

for (let expense of ExpenseData) {
  let exp = new Expense({
    item: expense.item,
    amount: expense.amount,
    date: expense.date,
    group: expense.group,
  });

  exp.save();
}
