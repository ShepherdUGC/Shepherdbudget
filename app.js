let income = 0;
let categories = [];

// Recommended percentage ranges
const recommended = {
  "Rent / Mortgage": [25, 35],
  "Electric": [2, 5],
  "Gas (utility)": [1, 3],
  "Water": [1, 2],
  "Trash": [0.5, 1],
  "Internet": [1, 3],
  "Phone": [2, 4],
  "Insurance": [5, 10],
  "Groceries": [8, 15],
  "Gas (car)": [3, 8],
  "Household supplies": [1, 3],
  "Personal care": [1, 3],
  "Eating out": [3, 8],
  "Entertainment": [2, 6],
  "Clothing": [2, 5],
  "Subscriptions": [1, 3],
  "Hobbies": [1, 4],
  "Savings": [5, 10],
  "Investments": [5, 10],
  "Extra debt payments": [5, 10],
  "Emergency fund": [3, 5],
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
  render();
}

function addCategory() {
  const name = document.getElementById("categorySelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);

  if (!amount || amount <= 0) return;

  categories.push({ name, amount });
  render();
}

function render() {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = "";

  if (income <= 0) {
    summaryDiv.innerHTML = "<p>Please enter your income.</p>";
    return;
  }

  categories.forEach(cat => {
    const pct = ((cat.amount / income) * 100).toFixed(1);
    const range = recommended[cat.name];

    let statusClass = "";
    let statusText = "";

    if (range) {
      const [min, max] = range;

      if (pct < min) {
        statusClass = "green";
        statusText = "Below recommended";
      } else if (pct > max) {
        statusClass = "red";
        statusText = "Above recommended";
      } else {
        statusClass = "green";
        statusText = "Within recommended";
      }
    }

    summaryDiv.innerHTML += `
      <div class="summary-item ${statusClass}">
        <strong>${cat.name}</strong><br>
        ${pct}% of income<br>
        Recommended: ${range[0]}–${range[1]}%<br>
        Status: ${statusText}
      </div>
    `;
  });
}
