let income = 0;
let categories = [];

// Recommended percentage ranges (updated to your real fixed expenses + tithing)
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

// Populate dropdown with categories
const categorySelect = document.getElementById("categorySelect");
Object.keys(recommended).forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

function setIncome() {
  income = parseFloat(document.getElementById("incomeInput").value);

  // Auto-add tithing at 10%
  const tithingAmount = income * 0.10;

  // Remove old tithing if it exists
  categories = categories.filter(c => c.name !== "Tithing");

  // Add updated tithing
  categories.push({ name: "Tithing", amount: tithingAmount });

  render();
}

function addCategory() {
  const name = document.getElementById("categorySelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);

  if (!amount || amount <= 0) return;

  categories.push({ name, amount });
  render();
}

function deleteCategory(index) {
  categories.splice(index, 1);
  render();
}

function render() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  if (income <= 0) {
    tableBody.innerHTML = `
      <tr><td colspan="6">Please enter your income.</td></tr>
    `;
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
        <td>${range[0]}–${range[1]}%</td>
        <td class="${statusClass}">${statusText}</td>
        <td><button class="delete-btn" onclick="deleteCategory(${index})">Delete</button></td>
      </tr>
    `;
  });

  // TOTAL BAR
  const totalPercent = ((totalSpent / income) * 100).toFixed(1);
  const remaining = income - totalSpent;

  document.getElementById("totalAmount").innerText = `$${totalSpent.toFixed(2)}`;
  document.getElementById("totalPercent").innerText = `${totalPercent}%`;
  document.getElementById("remainingIncome").innerText =
    `Remaining Income: $${remaining.toFixed(2)}`;
}
