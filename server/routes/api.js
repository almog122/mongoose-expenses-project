const express = require("express");
const Expense = require("../model/expense-model");
const dateUtil = require("../utilities/date-util");
const router = express.Router();

const DATE_FORMAT = {
  SHORT: "LLLL",
  DEFUALT: "YYYY-MM-DD"
}

router.get("/expenses", function (req, res) {
  let d1 = req.body.d1;
  let d2 = req.body.d2 == undefined ? dateUtil.convertMoment(DATE_FORMAT) : dateUtil.convertMoment(DATE_FORMAT , req.body.d2);

  if (d1 != undefined) {
    d1 = new Date(d1);
    d2 = new Date(d2);

    Expense.aggregate([
      { $match: { $and: [{ date: { $gte: d1 } }, { date: { $lte: d2 } }] } },
      {
        $group: {
          _id: `${dateUtil.convertMoment(DATE_FORMAT, d1)} until ${dateUtil.convertMoment(DATE_FORMAT, d2)}`,
          total: { $sum: "$amount" },
        },
      },
    ]).then(function (totalAmount) {
      res.send(totalAmount);
    });
    return;
  }

  Expense.find({})
    .sort({ date: -1 })
    .then(function (expenses) {
      res.send(dateUtil.convertExpensesArr(expenses));
    });
});

router.post("/expenses", function (req, res) {
  let item = req.body.item;
  let amount = req.body.amount;
  let group = req.body.group;
  let date = req.body.date == undefined ? dateUtil.convertMoment(DATE_FORMAT) : dateUtil.convertMoment(DATE_FORMAT , req.body.date);

  let exp = new Expense({
    item: item,
    amount: amount,
    date: date,
    group: group,
  });

  exp.save().then((newExp) => {
    res.status('201').send({result: `You spend ${newExp.amount}$ on ${newExp.item}`});

  }).catch((err) => {
    res.status('400').send({result: `Couldn't save`});

  });
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
    });
    return;
  }

  Expense.find({ group: group })
    .select("amount -_id")
    .then(function (expensesAmount) {
      res.send(expensesAmount);
    });
});

module.exports = router;
