const moment = require("moment");

const convertExpensesDateToMoment = function (expenses) {
  let covertedExpArr = [];

  expenses.forEach((expense) => {
    covertedExpArr.push(expense.momentDateConvert());
  });

  return covertedExpArr;
};

const convertDateToMoment = function (format , date) {

  return moment(date).format(format);

};

let convertMoment = convertDateToMoment
let convertExpensesArr = convertExpensesDateToMoment

module.exports = { convertExpensesArr , convertMoment};
