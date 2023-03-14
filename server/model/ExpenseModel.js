const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    item: String,
    amount: Number,
    date: Date,
    group: String,
  },
  {
    methods: {
      momentDateConvert() {
        return {
          item: this.item,
          amount: this.amount,
          date: moment(this.date).format("YYYY-MM-DD"),
          group: this.group,
        };
      },
    },
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
