const express = require("express");
const moment = require("moment");
const Expense = require("../model/ExpenseModel");

const router = express.Router();

const convertExpensesDateToMoment = function (expenses) {
  let covertedExpArr = [];

  expenses.forEach((expense) => {
    covertedExpArr.push(expense.momentDateConvert());
  });

  return covertedExpArr;
};

router.get("/expenses", function (req, res) {
  let d1 = req.body.d1;
  let d2 =
    req.body.d2 == undefined
      ? moment().format("YYYY-MM-DD")
      : moment(req.body.d2).format("YYYY-MM-DD");

  if (d1 != undefined) {
    d1 = new Date(d1);
    d2 = new Date(d2);

    Expense.aggregate([
      { $match: { $and: [{ date: { $gte: d1 } }, { date: { $lte: d2 } }] } },
      {
        $group: {
          _id: `${moment(d1).format("YYYY-MM-DD")} until ${moment(d2).format("YYYY-MM-DD")}`,
          total: { $sum: "$amount" },
        },
      },
    ]).then(function (totalAmount) {
      res.send(totalAmount);
      return;
    });
  } else {
    Expense.find({})
      .sort({ date: -1 })
      .then(function (expenses) {
        res.send(convertExpensesDateToMoment(expenses));
      });
  }
});

router.post("/expenses", function (req, res) {
  let item = req.body.item;
  let amount = req.body.amount;
  let group = req.body.group;
  let date =
    req.body.date == undefined
      ? moment().format("YYYY-MM-DD")
      : moment(req.body.date).format("YYYY-MM-DD");

  let exp = new Expense({
    item: item,
    amount: amount,
    date: date,
    group: group,
  });

  exp.save().then((exp) => {
    console.log(`spend ${exp.amount}$ on ${exp.item}`);
  });

  res.end();
});

router.put("/update/:group1/:group2", function (req, res) {
  let group1 = req.params.group1;
  let group2 = req.params.group2;

  Expense.findOneAndUpdate(
    { group: group1 },
    { group: group2 },
    { new: true }
  ).then(function (expense) {
    res.send(`${expense.item} group changed from ${group1} to ${group2}`);
  });
});

router.get("/expenses/:group", function (req, res) {
  let group = req.params.group;
  let total = req.body.total == true;

  if (total) {
    Expense.aggregate([
      { $match: { group: group } },
      {
        $group: {
          _id: group,
          total: { $sum: "$amount" },
        },
      },
    ]).then(function (totalAmount) {
      res.send(totalAmount);
      return;
    });
  }

  Expense.find({ group: group })
    .select("amount -_id")
    .then(function (expensesAmount) {
      res.send(expensesAmount);
    });
});

module.exports = router;
