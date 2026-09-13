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
