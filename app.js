let entries = [];

function formatAmount(amount) {
  return parseFloat(amount).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
  });
}

function getEntries() {
  return fetch("http://localhost:3000/entries")
    .then((response) => response.json())
    .then((data) => {
      entries = data || [];
      renderEntries();
    });
}

function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}

function setCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  const formattedToday = `${year}-${month}-${day}`;

  document.getElementById("entryDate").value = formattedToday;
  document.getElementById("currentDate").innerText = formatDate(today);
}

function deleteEntry(id) {
  fetch(`http://localhost:3000/entries/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      return getEntries();
    })
    .then(() => calculateTotal());
}

function addOrUpdateEntry() {
  const date = document.getElementById("entryDate").valueAsDate;
  const formattedDate = formatDate(date);
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  const entry = {
    date: formattedDate,
    amount: amount,
    category: category,
  };

  const existingEntry = entries.find(
    (e) => e.date === formattedDate && e.category === category
  );

  if (existingEntry) {
    fetch(`http://localhost:3000/entries/${existingEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
      .then(() => {
        return getEntries();
      })
      .then(() => calculateTotal());
  } else {
    fetch("http://localhost:3000/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
      .then(() => {
        return getEntries();
      })
      .then(() => calculateTotal());
  }
}

function calculateTotal() {
  let totalIncome = 0;
  let totalExpense = 0;

  for (let entry of entries) {
    const amount = parseFloat(entry.amount);
    if (amount > 0) {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }
  }

  document.getElementById("totalIncome").innerText = formatAmount(totalIncome); // форматирование суммы
  document.getElementById("totalExpense").innerText =
    formatAmount(totalExpense); // форматирование суммы
  document.getElementById("totalSum").innerText = formatAmount(
    totalIncome + totalExpense
  ); // форматирование суммы
}

function renderEntries() {
  const table = document.getElementById("entries");
  table.innerHTML = "";

  for (let entry of entries) {
    const row = table.insertRow();
    row.insertCell(0).innerText = entry.id; // Теперь используем ID в качестве номера строки
    row.insertCell(1).innerText = formatPaymentDate(entry.date);
    row.insertCell(2).innerText = formatAmount(entry.amount); // форматирование суммы
    row.insertCell(3).innerText = entry.category;

    const editButtonCell = row.insertCell(4);
    const editButton = document.createElement("button");
    editButton.innerText = "Редактировать";
    editButton.onclick = () => loadEntryForEdit(entry.id);
    editButtonCell.appendChild(editButton);

    const deleteButtonCell = row.insertCell(5);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Удалить";
    deleteButton.onclick = () => deleteEntry(entry.id);
    deleteButtonCell.appendChild(deleteButton);
  }
}

function loadEntryForEdit(id) {
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    document.getElementById("entryDate").value = entry.date;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("category").value = entry.category;
  }
}

function formatPaymentDate(payment) {
  const [year, month, day] = payment.date.split("-");
  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
}

setCurrentDate();
getEntries().then(() => calculateTotal());
