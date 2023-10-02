let entries = [];

function getEntries() {
  fetch("http://localhost:3000/entries")
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

function addOrUpdateEntry() {
  const date = document.getElementById("entryDate").valueAsDate;
  const formattedDate = formatDate(date);
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  const entry = {
    date: formattedDate,
    amount: amount,
    category: category
  };

  // Добавим новую запись с помощью POST запроса
  fetch("http://localhost:3000/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  }).then(() => {
    updateOrAddRow(entry);
    getEntries(); // получаем обновленные данные для согласованности
  });
}

function renderEntries() {
  const table = document.getElementById("entries");
  table.innerHTML = "";

  for (let entry of entries) {
    updateOrAddRow(entry);
  }
}

function updateOrAddRow(entry) {
  const table = document.getElementById("entries");
  let row = Array.from(table.rows).find(
    (r) => r.cells[1].innerText === entry.date
  );

  if (row) {
    // Если строка для этой даты уже существует, обновите ее
    row.cells[2].innerText = entry.amount;
    row.cells[3].innerText = entry.category;
  } else {
    // Если строки нет, добавьте новую
    row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length; // номер строки
    row.insertCell(1).innerText = entry.date;
    row.insertCell(2).innerText = entry.amount;
    row.insertCell(3).innerText = entry.category;
  }
}

function renderEntries() {
  const table = document.getElementById("entries");
  table.innerHTML = "";

  let dayCounter = 1;
  for (let entry of entries) {
    const row = table.insertRow();
    row.insertCell(0).innerText = dayCounter++;
    row.insertCell(1).innerText = entry.date;
    row.insertCell(2).innerText = entry.amount;
    row.insertCell(3).innerText = entry.category;
  }
}

setCurrentDate();
getEntries();
