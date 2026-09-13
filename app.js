let categories = JSON.parse(localStorage.getItem("categories")) || [];

function save() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function addCategory() {
  const name = prompt("Category name:");
  if (!name) return;
  categories.push({ name, amount: 0 });
  save();
  render();
}

function render() {
  const income = Number(document.getElementById("income").value);
  const catDiv = document.getElementById("categories");
  const summaryDiv = document.getElementById("summary");

  catDiv.innerHTML = "";
  summaryDiv.innerHTML = "";

  categories.forEach((cat, i) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <strong>${cat.name}</strong>
      <input type="number" value="${cat.amount}" 
        onchange="updateAmount(${i}, this.value)">
    `;
    catDiv.appendChild(row);
  });

  if (income > 0) {
    categories.forEach(cat => {
      const pct = ((cat.amount / income) * 100).toFixed(1);
      summaryDiv.innerHTML += `<p>${cat.name}: ${pct}%</p>`;
    });
  }
}

function updateAmount(index, value) {
  categories[index].amount = Number(value);
  save();
  render();
}

document.getElementById("addBtn").onclick = addCategory;

render();

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
