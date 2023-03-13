const express = require("express");
const moment = require("moment");
let Expense = require("../model/ExpenseModel");
const router = express.Router();

const convertExpensesDateToMoment = function(expenses) {
    let covertedExpArr = [];

    expenses.forEach(expense => {
        covertedExpArr.push(expense.momentDate())
    });

    return covertedExpArr;
}

router.get("/expenses", function (req, res) {
    Expense.find({}).sort({ date: 1 }).then(function (expenses) {
        res.send(convertExpensesDateToMoment(expenses))
    });
});

module.exports = router;
