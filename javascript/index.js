var inputname = document.getElementById("username");
var inputpassword = document.getElementById("password");
var login = document.getElementById("login-button");
var infoPage = document.getElementById("info-page");
var mainPage = document.getElementById("main-page");
var newUser = document.getElementById("new-user");
var newPassword = document.getElementById("new-password");
var confirmPassword = document.getElementById("confirm-password");
var signupPage = document.getElementById("signup-page");
var signupSubmit = document.getElementById("signup-submit");
var loginInfo = document.getElementById("login-box"),
  walletAmount = document.getElementById("display-wallet");
let logoutBtn = document.getElementById("logout-btn");
var username, password;
let transactionDetails;
let previousWalletAmt = 0;
let previousWallet = document.getElementById("previous-wallet");
let currentWallet = document.getElementById("current-wallet");
let note = document.getElementById("note");
let currentTransaction;
let categoryOption = [];
let editCategory = document.getElementById("edit-category");
let editAmount = document.getElementById("edit-amount");
let editDate = document.getElementById("edit-date");
let editNecessary = document.getElementById("edit-necessary");
let editUnnecessary = document.getElementById("edit-unnecessary");
let editNote = document.getElementById("edit-note");

logoutBtn.addEventListener("click", () => {
  location.reload();
});
walletAmount.addEventListener("submit", (e) => {
  e.preventDefault();
  let budget = document.getElementById("budget");
  fetch("http://localhost:3000/addAmount", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      budget: budget.value,
    }),
  })
    .then(async (addAmount) => {
      if (addAmount.ok) {
        alert("Amount updated");
        budget.value = "";
        let amount = await addAmount.json();
        console.log("amount: ", amount);
        currentWallet.value = amount.currentWalletValue;
        document.getElementById("previous-wallet-label").style.display =
          "inline";
        previousWallet.value = amount.previousValue;
      }
    })

    .catch((err) => console.log(err));

  walletCloseButton.click();
});

login.addEventListener("click", async () => {
  await getLoginData(inputname, inputpassword);
});
var signup = document.getElementById("signup");
signup.addEventListener("click", navigateToSignupPage);
// Function to navigate the user to sign up page.
function navigateToSignupPage() {
  loginInfo.style = "display:none";
  signupPage.style = "display:flex";
  newUser.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
}
// Function to add a new user when the submit button is clicked.
signupSubmit.addEventListener("click", async () => {
  if (!(newUser.value.length == 0)) {
    if (validateEmail(newUser)) {
      if (!(newPassword.value.length == 0)) {
        if (newPassword.value == confirmPassword.value) {
          await addNewUser(newUser, newPassword);
        } else {
          mismatch.innerHTML = "Password mismatch";
        }
      } else {
        alert("Enter new password");
      }
    } else {
      alert("Enter username with @domain");
    }
  } else {
    alert("Enter username");
  }
});
// Function to validate email id is with domain
function validateEmail(input) {
  var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}
var backToLogin = document.getElementById("back-to-login");
backToLogin.addEventListener("click", () => {
  loginInfo.style = "display: block";
  signupPage.style = "display : none";
  inputname.value = "";
  inputpassword.value = "";
});
async function addNewUser(newUser, newPassword) {
  try {
    var newUserId = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUser.value,
        password: newPassword.value,
      }),
    });
    if (newUserId.ok) {
      infoPage.style = "display:none";
      signupPage.style = "display:none";
      mainPage.style = "display:block";
      let tempUser = newUser.value;
      username = tempUser;
    }
  } catch (Error) {
    alert(Error.message);
  }
}

async function getLoginData(inputname, inputpassword) {
  var fetchUserData = await fetch("http://localhost:3000/loginPage", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({
      username: inputname.value,
      password: inputpassword.value,
    }),
  });
  if (fetchUserData.ok) {
    alert("Login success");
    infoPage.style = "display:none";
    mainPage.style = "display:block";
    username = inputname.value;
    password = inputpassword.value;
    inputname.value = "";
    inputpassword.value = "";
    await defaultFunction();
    document.getElementById("previous-wallet-label").style.display = "inline";
    previousWallet.value = 0;
    currentWallet.value = transactionDetails.wallet;
  } else {
    alert("login failed");
  }
}

let newTransaction = document.getElementById("new-transaction");
newTransaction.addEventListener("submit", (e) => {
  let category = document.getElementById("category"),
    date = document.getElementById("date"),
    amount = document.getElementById("amount");
  let expense;
  if (document.getElementById("unnecessary").checked) {
    expense = document.getElementById("unnecessary");
  } else if (document.getElementById("necessary").checked) {
    expense = document.getElementById("necessary");
  }
  e.preventDefault();

  fetch("http://localhost:3000/addTransaction", {
    method: "POST",

    headers: {
      Accept: "application/json, text/plain,*/*",

      "Content-type": "application/json",
    },

    body: JSON.stringify({
      category: category.value,
      date: date.value,
      amount: amount.value,
      expense: expense.value,
      note: note.value,
    }),
  })
    .then(async (data) => {
      let walletAmounts = await data.json();

      if (data.ok) {
        defaultFunction();
        alert("Entry successful");
        category.value = "food";
        date.value = "";
        amount.value = "";
        expense.checked = false;
        note.value = "";
        currentWallet.value = walletAmounts.currentvalue;
      }
      console.log(expense);
    })

    .catch((err) => console.log(err));

  closeButton.click();
});
//transaction
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

//budget
const wallet = document.querySelector(".wallet");
const walletTrigger = document.querySelector(".wallet-trigger");
const walletCloseButton = document.querySelector(".wallet-close-button");

function toggleModal1() {
  wallet.classList.toggle("wallet-show-modal");
}

function windowOnClick1(event) {
  if (event.target === wallet) {
    toggleModal1();
  }
}

walletTrigger.addEventListener("click", toggleModal1);
walletCloseButton.addEventListener("click", toggleModal1);
window.addEventListener("click", windowOnClick1);

function createCard(amount, date, category, expensetype, idName) {
  console.log(date);
  let card = document.getElementById("expense-card");
  let expenseCard = document.createElement("div");
  expenseCard.setAttribute("class", "expense-card-details");
  expenseCard.setAttribute("id", idName);
  // expenseCard.onclick = function () {
  //   currentTransaction = expenseCard.id;
  //   displaySelectedTransactionDetails(expenseCard);
  // };

  card.appendChild(expenseCard);
  let expenseAmount = document.createElement("div");
  let expenseDate = document.createElement("div");
  let expenseCategory = document.createElement("div");
  let expenseAmounttext = document.createElement("div");
  let expenseDatetext = document.createElement("div");
  let expenseCategorytext = document.createElement("div");
  let expenseAmountvalue = document.createElement("div");
  let expenseDatevalue = document.createElement("div");
  let expenseCategoryvalue = document.createElement("div");
  let expenseType = document.createElement("div");
  let expenseTypeText = document.createElement("div");
  let expenseTypeValue = document.createElement("div");
  expenseAmount.setAttribute("class", "expense-amount");
  expenseDate.setAttribute("class", "expense-date");
  expenseCategory.setAttribute("class", "expense-category");
  expenseCard.appendChild(expenseAmount);
  expenseCard.appendChild(expenseType);
  expenseType.appendChild(expenseTypeText);
  expenseType.appendChild(expenseTypeValue);
  expenseCard.appendChild(expenseDate);
  expenseCard.appendChild(expenseCategory);
  expenseAmount.appendChild(expenseAmounttext);
  expenseDate.appendChild(expenseDatetext);
  expenseCategory.appendChild(expenseCategorytext);
  expenseAmount.appendChild(expenseAmountvalue);
  expenseDate.appendChild(expenseDatevalue);
  expenseCategory.appendChild(expenseCategoryvalue);
  expenseAmounttext.innerHTML = "Amount";
  expenseAmounttext.style.fontWeight = "900";
  expenseDatetext.style.fontWeight = "900";
  expenseCategorytext.style.fontWeight = "900";
  expenseTypeText.style.fontWeight = "900";
  expenseDatetext.innerHTML = "Date";
  expenseCategorytext.innerHTML = "Category";
  expenseAmountvalue.innerHTML = amount;
  expenseDatevalue.innerHTML = date;
  expenseCategoryvalue.innerHTML = category;
  expenseTypeText.innerHTML = "Expense Type";
  expenseTypeValue.innerHTML = expensetype;

  let editIcon = document.createElement("img");
  editIcon.setAttribute("src", "assets/edit.png");
  editIcon.classList.add("edit-icon");
  expenseCard.appendChild(editIcon);
  editIcon.onclick = function () {
    currentTransaction = expenseCard.id;
    displaySelectedTransactionDetails(expenseCard);
  };

  let deleteIcon = document.createElement("img");
  deleteIcon.setAttribute("src", "assets/delete.png");
  deleteIcon.classList.add("edit-icon");
  expenseCard.appendChild(deleteIcon);
  deleteIcon.onclick = function () {
    currentTransaction = expenseCard.id;
    deleteTransaction();
  };
}

function displaySelectedTransactionDetails() {
  toggleModal2();
  let editOption = document.getElementById("edit-category");
  editOption.replaceChildren();
  for (let i = 0; i < editOption.options.length; i++) {
    categoryOption[i] = editOption.options[i].value;
  }
  for (let i = 0; i < categoryOption.length; i++) {
    var option = document.createElement("option");
    option.text = `${categoryOption[i]}`;
    option.value = `${categoryOption[i]}`;
    editOption.appendChild(option);
  }

  editCategory.value =
    transactionDetails.transactions[`${currentTransaction}`].category;
  editAmount.value =
    transactionDetails.transactions[`${currentTransaction}`].amount;
  editDate.value =
    transactionDetails.transactions[`${currentTransaction}`].date;
  if (
    transactionDetails.transactions[`${currentTransaction}`].typeOfExpense ==
    "Necessary"
  ) {
    editNecessary.checked = true;
  } else {
    editUnnecessary.checked = true;
  }
  transactionDetails.transactions[`${currentTransaction}`].date;
  editNote.value =
    transactionDetails.transactions[`${currentTransaction}`].note;
}
async function deleteTransaction() {
  var result = confirm("Do you really want to delete this transaction?");
  if (result) {
    let output = await fetch("http://localhost:3000/delete-transaction", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: `${currentTransaction}` }),
    });
    if (output.ok) {
      defaultFunction();
    }
  }
}
let editTransactionBtn = document.getElementById("edit-transaction-btn");
editTransactionBtn.addEventListener("click", editTransactionDetails);
async function editTransactionDetails() {
  let category = editCategory.value;
  let amount = editAmount.value;
  let date = editDate.value;
  let expense;
  if (editUnnecessary.checked) {
    expense = editUnnecessary.value;
  } else if (editNecessary.checked) {
    expense = editNecessary.value;
  }
  let note = editNote.value;
  try {
    let output = await fetch("http://localhost:3000/editTransaction", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        category: category,
        date: date,
        amount: amount,
        expense: expense,
        note: note,
        id: currentTransaction,
      }),
    });
    let walletData = await output.json();
    if (output.ok) {
      defaultFunction();
      alert("Saved changes successfully");
      console.log(walletData);
      currentWallet.value = walletData.currentvalue;
      editCloseButton.click();
    }
  } catch (error) {
    alert(error.message);
  }
}
async function defaultFunction() {
  let taskData = await fetch("http://localhost:3000/getDetails", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  transactionDetails = await taskData.json();
  let select = document.getElementById("category");
  for (let i = 0; i < select.options.length; i++) {
    categoryOption[i] = select.options[i].value;
  }
  for (let i = 0; i < transactionDetails.transactions.length; i++) {
    if (!categoryOption.includes(transactionDetails.transactions[i].category)) {
      console.log("jnjj");
      var option = document.createElement("option");
      categoryOption.push(transactionDetails.transactions[i].category);
      option.text = `${transactionDetails.transactions[i].category}`;
      option.value = `${transactionDetails.transactions[i].category}`;
      select.appendChild(option);
    }
  }

  let expense_card = document.getElementById("expense-card");
  expense_card.replaceChildren();
  for (let i = 0; i < transactionDetails.transactions.length; i++) {
    createCard(
      transactionDetails.transactions[i].amount,
      transactionDetails.transactions[i].date,
      transactionDetails.transactions[i].category,
      transactionDetails.transactions[i].typeOfExpense,
      i
    );
  }
}

const summary = document.querySelector(".summary");
const monthSummary = document.querySelector(".month-summary");
const summaryCloseBtn = document.querySelector(".summary-close-button");

function summaryModal() {
  summary.classList.toggle("summary-show-modal");
}

function windowOnClickSummary(event) {
  if (event.target === summary) {
    summaryModal();
  }
}

monthSummary.addEventListener("click", summaryModal);
summaryCloseBtn.addEventListener("click", summaryModal);
window.addEventListener("click", windowOnClickSummary);
document
  .getElementById("month-summary")
  .addEventListener("click", displayMonthSummary);

function displayMonthSummary() {
  console.log(transactionDetails);
  let currentDate = new Date().toLocaleDateString().split("/");
  let month = currentDate[1];
  let year = currentDate[2];
  console.log(month, year);
  console.log(currentDate);
  let month_data = [];
  let month_expense = 0,
    necessary = 0,
    unnecessary = 0;
  console.log(transactionDetails.transactions.length);
  for (let i = 0; i < transactionDetails.transactions.length; i++) {
    console.log(transactionDetails.transactions[i].date.split("-")[1]);
    if (
      transactionDetails.transactions[i].date.split("-")[1] == month &&
      transactionDetails.transactions[i].date.split("-")[0] == year
    ) {
      month_data.push(transactionDetails.transactions[i]);
      month_expense += parseInt(transactionDetails.transactions[i].amount);
      if (transactionDetails.transactions[i].typeOfExpense == "Necessary") {
        necessary += parseInt(transactionDetails.transactions[i].amount);
      } else if (
        transactionDetails.transactions[i].typeOfExpense == "Unnecessary"
      ) {
        unnecessary += parseInt(transactionDetails.transactions[i].amount);
      }
    }
  }
  console.log(month_expense);
  console.log(month_data, necessary + unnecessary);
  let category = document.getElementById("category");
  let categoryValue = [],
    categoryAmount = [];
  console.log(category);
  for (let i = 0; i < category.options.length; i++) {
    categoryValue[i] = category.options[i].value;
  }
  console.log(categoryValue);
  for (let i = 0; i < categoryValue.length; i++) {
    categoryAmount[i] = 0;
    for (let j = 0; j < month_data.length; j++) {
      if (categoryValue[i] == month_data[j].category) {
        categoryAmount[i] += parseInt(month_data[j].amount);
      }
    }
  }
  console.log(categoryAmount);
  let card = document.getElementById("display-month-summary");
  card.replaceChildren();
  let totalExpense = document.createElement("div");
  totalExpense.setAttribute("id", "total-expense");
  totalExpense.innerHTML = `Total Expense : ${month_expense}`;
  totalExpense.classList.add("total-expense");
  card.appendChild(totalExpense);

  let necessaryLabel = document.createElement("div");
  necessaryLabel.innerHTML = `Necessary Expense`;
  card.appendChild(necessaryLabel);

  let necessaryExpense = document.createElement("progress");
  necessaryExpense.setAttribute("id", "total-expense-necessary");
  necessaryExpense.setAttribute("max", `${month_expense}`);
  necessaryExpense.setAttribute("value", `${necessary}`);
  card.appendChild(necessaryExpense);

  let unnecessaryLabel = document.createElement("div");
  unnecessaryLabel.innerHTML = `Unnecessary Expense`;
  card.appendChild(unnecessaryLabel);

  let unnecessaryExpense = document.createElement("progress");
  unnecessaryExpense.setAttribute("id", "total-expense-unnecessary");
  unnecessaryExpense.setAttribute("max", `${month_expense}`);
  unnecessaryExpense.setAttribute("value", `${unnecessary}`);
  card.appendChild(unnecessaryExpense);

  for (let i = 0; i < categoryValue.length; i++) {
    let categoryLabel = document.createElement("div");
    categoryLabel.innerHTML = `${categoryValue[i]}`;
    card.appendChild(categoryLabel);

    let categoryPercent = document.createElement("progress");
    categoryPercent.setAttribute("max", `${month_expense}`);
    categoryPercent.setAttribute("value", `${categoryAmount[i]}`);
    card.appendChild(categoryPercent);
  }
}

const editModal = document.querySelector(".edit-modal");
const editCloseButton = document.querySelector(".edit-close-button");

function toggleModal2() {
  editModal.classList.toggle("edit-show-modal");
}

function windowOnClick2(event) {
  if (event.target === editModal) {
    toggleModal2();
  }
}

editCloseButton.addEventListener("click", toggleModal2);
window.addEventListener("click", windowOnClick2);

//Add category
let addCategory = document.getElementById("add-category-btn");
addCategory.addEventListener("click", addNewCategoryToDropDown);

function addNewCategoryToDropDown() {
  let select = document.getElementById("category");
  let categoryValue = document.getElementById("add-category");
  if (categoryValue.value.length !== 0) {
    if (!categoryOption.includes(categoryValue.value)) {
      var option = document.createElement("option");
      option.text = `${categoryValue.value}`;
      option.value = `${categoryValue.value}`;
      select.appendChild(option);
      select.value = categoryValue.value;
    }
    categoryValue.value = "";
  }
}
