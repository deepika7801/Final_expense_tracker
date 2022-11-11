const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
let currentUser;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
// render main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Validate username and password in user.json file using post method
app.post("/loginPage", (req, res) => {
  var data = JSON.parse(fs.readFileSync("./data/user.json"));
  if (req.body.username in data) {
    if (req.body.password == data[req.body.username]) {
      let currentName = req.body.username;
      currentUser = currentName;
      res.status(200).json({ data: "success" });
      res.end();
    } else {
      res.status(404).json({ error: "invalid password" });
    }
  } else {
    res.status(404).json({ error: "not found" });
    res.end();
  }
});

//Validate and store the user details in user.json using post method
app.post("/signup", (req, res) => {
  var data = JSON.parse(fs.readFileSync("./data/user.json"));
  if (!(req.body.username in data)) {
    data[req.body.username] = req.body.password;
    var mailData = JSON.stringify(data);
    fs.writeFile("./data/user.json", mailData, () => {});
    var userTransactions = { wallet: 0, transactions: [] };
    userTransactions = JSON.stringify(userTransactions);
    fs.writeFile(
      `./data/${req.body.username}.json`,
      userTransactions,
      () => {}
    );
    let currentName = req.body.username;
    currentUser = currentName;
    res.status(200).json({ walletAmount: userTransactions.wallet });
    res.end();
  } else {
    res.status(404).json({ error: "already exists" });
    res.end();
  }
});

//Add new transaction in json file using the post method
app.post("/addTransaction", (req, res) => {
  var data = JSON.parse(fs.readFileSync(`./data/${currentUser}.json`));
  let category = req.body.category;
  let date = req.body.date;
  let amount = req.body.amount;
  let typeOfExpense = req.body.expense;
  let note = req.body.note;
  if (
    category.length != 0 &&
    date.length != 0 &&
    amount.length != 0 &&
    note.length != 0
  ) {
    data.transactions.push({
      category: category,
      date: date,
      amount: amount,
      typeOfExpense: typeOfExpense,
      note: note,
    });
    let wallet = data.wallet;
    let currentvalue = parseInt(data.wallet) - parseInt(amount);
    data.wallet = currentvalue;
    data = JSON.stringify(data);
    fs.writeFileSync(`./data/${currentUser}.json`, data, () => {});
    res.status(200).json({ walletAmount: wallet, currentvalue: currentvalue });
  }
});

//Get the transaction details of the current user from json
app.get("/getDetails", (req, res) => {
  let data = JSON.parse(fs.readFileSync(`./data/${currentUser}.json`));
  res.json(data);
});

//Add the wallet amount
app.post("/addAmount", (req, res) => {
  var data = JSON.parse(fs.readFileSync(`./data/${currentUser}.json`));
  let budget = req.body.budget;
  let wallet = data.wallet;
  let currentWalletValue = parseInt(data.wallet) + parseInt(budget);
  data.wallet = currentWalletValue;
  data = JSON.stringify(data);
  fs.writeFileSync(`./data/${currentUser}.json`, data, () => {});
  res
    .status(200)
    .json({ previousValue: wallet, currentWalletValue: currentWalletValue });
});

//Update the transaction details in json file
app.post("/editTransaction", (req, res) => {
  var data = JSON.parse(fs.readFileSync(`./data/${currentUser}.json`));
  let category = req.body.category;
  let date = req.body.date;
  let amount = req.body.amount;
  let typeOfExpense = req.body.expense;
  let note = req.body.note;
  let editIndex = req.body.id;
  let oldAmount = data.transactions[editIndex].amount;
  let newAmount = amount;
  if (oldAmount > newAmount) {
    data.wallet += oldAmount - newAmount;
  } else {
    data.wallet -= newAmount - oldAmount;
  }
  if (
    category.length != 0 &&
    date.length != 0 &&
    amount.length != 0 &&
    note.length != 0
  ) {
    data.transactions[editIndex].category = category;
    data.transactions[editIndex].amount = amount;
    data.transactions[editIndex].typeOfExpense = typeOfExpense;
    data.transactions[editIndex].note = note;
    data.transactions[editIndex].date = date;
    console.log(data);
    let currentvalue = data.wallet;
    console.log("currentvalue: ", currentvalue);

    data = JSON.stringify(data);
    fs.writeFileSync(`./data/${currentUser}.json`, data, () => {});
    res.status(200).json({ currentvalue: currentvalue });
  }
});

//Delete the selected transaction in json file using POST method
app.post("/delete-transaction", (req, res) => {
  var data = JSON.parse(fs.readFileSync(`./data/${currentUser}.json`));
  let deleteIndex = req.body.id;
  delete data.transactions[deleteIndex];
  var filteredData = data.transactions.filter(function (el) {
    return el != null;
  });
  var userTransactions = {
    wallet: `${data.wallet}`,
    transactions: [],
  };
  for (let i = 0; i < filteredData.length; i++) {
    userTransactions.transactions.push(filteredData[i]);
  }
  userTransactions = JSON.stringify(userTransactions);
  fs.writeFileSync(`./data/${currentUser}.json`, userTransactions, () => {});
  res.status(200).json({ data: "success" });
});

//listen to port number 3000.
app.listen(3000);
