const buttonWrap = document.getElementById("button-wrapper");
const itemWrap = document.getElementById("item-wrapper");
const totalAmountEl = document.getElementById("total-cash");
const addBtn = document.getElementById("add-button");
const restockBtn = document.getElementById("restock-button");
const invoiceBtn = document.getElementById("invoice-btn");
const messageEl = document.getElementById("insufficient-message");
const errorMessage = document.getElementById("error-message");
const closeIcon = document.getElementById("close-icon");

let inventory = {
  "Kit Kat": { price: 0.82, quantity: 20 },
  Snickers: { price: 0.98, quantity: 6 },
  Twix: { price: 1.96, quantity: 4 },
  Toblerone: { price: 2.38, quantity: 62 },
  Butterfinger: { price: 2.38, quantity: 86 },
  "M&Ms": { price: 3.88, quantity: 48 },
};

let selected_items = {};

addBtn.addEventListener("click", function () {
  let itemName = document.getElementById("item-input");
  let itemPrice = document.getElementById("price-input");
  let itemQuantity = document.getElementById("quantity-input");

  if (inventory[itemName.value]) {
    inventory[itemName.value].quantity += parseInt(itemQuantity.value);
  } else {
    inventory[itemName.value] = {
      price: parseFloat(itemPrice.value),
      quantity: parseInt(itemQuantity.value),
    };
  }

  renderButtons();
  renderSelect();
  renderTable();

  itemName.value = "";
  itemPrice.value = "";
  itemQuantity.value = "";
});

restockBtn.addEventListener("click", function () {
  let itemName = document.getElementById("item-select");
  let itemQuantity = document.getElementById("restock-quantity-input");

  inventory[itemName.value].quantity += parseInt(itemQuantity.value);
  itemName.value = "";
  itemQuantity.value = "";

  renderSelect();
  renderTable();
  renderButtons();
});

invoiceBtn.addEventListener("click", function () {
  for (let key in selected_items) {
    inventory[key].quantity -= selected_items[key];
  }
  selected_items = {};
  itemWrap.innerHTML = "";
  totalAmountEl.innerHTML = "$0";
  totalAmountEl.style.color = "#918E9B";

  renderButtons();
  renderSelect();
  renderTable();
});

function renderSelect() {
  let contents = '<option value="">Select item</option>';

  for (let key in inventory) {
    contents += `<option value="${key}">${key}</option>`;
  }

  document.getElementById("item-select").innerHTML = contents;
}

function renderButtons() {
  let contents = "";

  for (let key in inventory) {
    contents += `
        <button class="item-btn" onclick="itemSelect('${key}')">
        ${key}: $${inventory[key].price}
        </button>`;
  }

  buttonWrap.innerHTML = contents;
}

function renderItems() {
  // is object empty
  if (Object.keys(selected_items).length === 0) {
    totalAmountEl.style.color = "#918E9B";
    itemWrap.innerHTML = "";
    totalAmountEl.innerHTML = `$0`;
    return;
  }

  let contents = "";
  let amount = 0;

  for (let key in selected_items) {
    price = Math.round(inventory[key].price * selected_items[key] * 100) / 100;
    amount += price;

    contents += `<div class="item-entry">
            <div class="item-name-wrapper">
              <span class="item-name">${key}</span>
              <span class="crossmark">x</span>
              <span class="item-quantity">${selected_items[key]}</span>
              <span class="remove-btn" onclick="itemRemove('${key}')">Remove</span>
              <span class="remove-all-btn" onclick="itemRemoveAll('${key}')">Remove all</span>
            </div>

            <div class="price-wrapper">
              <span class="dollar-sign">$</span
              ><span class="item-price">${price}</span>
            </div>
        </div>`;
  }

  itemWrap.innerHTML = contents;
  totalAmountEl.innerHTML = `$${Math.round(amount * 100) / 100}`;
  totalAmountEl.style.color = "#4A4E74";
}

function renderTable() {
  let tableHead = document.getElementById("table-body");

  let content = "";
  let index = 0;

  for (let key in inventory) {
    let quantity = inventory[key].quantity;

    lowOnStock = quantity < 10 ? "low-on-stock" : "available";

    content += `<tr>
      <td class="table-index">${index++}</td>
      <td class="table-item">${key}</td>
      <td>${quantity} <span class=${lowOnStock}>↓</span></td>
    </tr>`;
  }

  tableHead.innerHTML = content;
}

function itemSelect(key) {
  let quantity = 1;
  if (selected_items[key]) {
    quantity = selected_items[key] + 1;
  }

  if (quantity > inventory[key].quantity) {
    errorMessage.innerHTML = `Not enough <b>${key}</b> in stock`;
    messageEl.style.display = "flex";
    return;
  }

  selected_items[key] = quantity;
  renderItems();
}

function itemRemove(key) {
  // item already selected
  if (selected_items[key] == 1) {
    delete selected_items[key];
  } else {
    selected_items[key]--;
  }
  renderItems();
}

function itemRemoveAll(key) {
  delete selected_items[key];
  renderItems();
}

closeIcon.addEventListener("click", function () {
  messageEl.style.display = "none";
});

renderSelect();
renderTable();
renderButtons();
