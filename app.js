let currentMonth = "";
let income = 0;
let categories = [];

// Recommended percentage ranges
const recommended = {
  // FIXED ESSENTIALS (your real expenses)
  "Rent / Mortgage": [45, 55],
  "Electric": [3, 6],
  "Gas (utility)": [2, 5],
  "Internet": [2, 4],
  "Insurance": [8, 12],

  // TITHING
  "Tithing": [10, 10],

  // VARIABLE ESSENTIALS
  "Groceries": [8, 15],
  "Gas (car)": [3, 8],
  "Household supplies": [1, 3],
  "Personal care": [1, 3],

  // LIFESTYLE
  "Eating out": [3, 8],
  "Entertainment": [2, 6],
  "Clothing": [2, 5],
  "Subscriptions": [1, 3],
  "Hobbies": [1, 4],

  // FINANCIAL GOALS
  "Savings": [5, 10],
  "Investments": [5, 10],
  "Extra debt payments": [5, 10],
  "Emergency fund": [3, 5],

  // IRREGULAR / ANNUAL
  "Car maintenance": [2, 4],
  "Car registration": [0.5, 1],
  "Medical": [2, 5],
  "Gifts": [1, 3],
  "Travel": [2, 5]
};

// Populate category dropdown
const categorySelect = document.getElementById("categorySelect");
Object.keys(recommended).forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

// Month dropdown
const monthSelect = document.getElementById("monthSelect");
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function initMonths() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  for (let i = 0; i < 12; i++) {
    const value = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${monthNames[i]} ${currentYear}`;
    monthSelect.appendChild(option);
  }

  const defaultValue = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}`;
  monthSelect.value = defaultValue;
  currentMonth = defaultValue;

  loadMonthData();
}

function changeMonth() {
  currentMonth = monthSelect.value;
  loadMonthData();
}

function getStorageKey() {
  return `budget_${currentMonth}`;
}

function loadMonthData() {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);

  if (saved) {
    const data = JSON.parse(saved);
    income = data.income || 0;
    categories = data.categories || [];
  } else {
    income = 0;
    categories = [];
  }

  document.getElementById("incomeInput").value = income || "";
  render();
}

function saveMonthData() {
  const key = getStorageKey();
  const data = { income, categories };
  localStorage.setItem(key, JSON.stringify(data));
}

function setIncome() {
  income = parseFloat(document.getElementById("incomeInput").value) || 0;
  saveMonthData();
  render();
}

function addCategory() {
  const name = document.getElementById("categorySelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);

  if (!amount || amount <= 0) return;

  categories.push({ name, amount });
  document.getElementById("amountInput").value = "";
  saveMonthData();
  render();
}

function deleteCategory(index) {
  categories.splice(index, 1);
  saveMonthData();
  render();
}

function render() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  if (income <= 0) {
    tableBody.innerHTML = `
      <tr><td colspan="6">Please enter your income for this month.</td></tr>
    `;
    document.getElementById("totalAmount").innerText = "$0.00";
    document.getElementById("totalPercent").innerText = "0%";
    document.getElementById("remainingIncome").innerText =
      `Remaining Income: $0.00`;
    return;
  }

  let totalSpent = 0;

  categories.forEach((cat, index) => {
    const pct = ((cat.amount / income) * 100).toFixed(1);
    const range = recommended[cat.name];

    let statusClass = "";
    let statusText = "";

    if (range) {
      const [min, max] = range;

      if (pct < min) {
        statusClass = "red";
        statusText = "Below recommended";
      } else if (pct > max) {
        statusClass = "red";
        statusText = "Above recommended";
      } else {
        statusClass = "green";
        statusText = "Within recommended";
      }
    }

    totalSpent += cat.amount;

    tableBody.innerHTML += `
      <tr>
        <td>${cat.name}</td>
        <td>$${cat.amount.toFixed(2)}</td>
        <td>${pct}%</td>
        <td>${range ? `${range[0]}–${range[1]}%` : "N/A"}</td>
        <td class="${statusClass}">${statusText}</td>
        <td><button class="delete-btn" onclick="deleteCategory(${index})">Delete</button></td>
      </tr>
    `;
  });

  const totalPercent = ((totalSpent / income) * 100).toFixed(1);
  const remaining = income - totalSpent;

  document.getElementById("totalAmount").innerText = `$${totalSpent.toFixed(2)}`;
  document.getElementById("totalPercent").innerText = `${totalPercent}%`;
  document.getElementById("remainingIncome").innerText =
    `Remaining Income: $${remaining.toFixed(2)}`;
}

// Initialize
initMonths();
