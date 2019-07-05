import { saveCustomer, deleteCustomer } from "./action.js";
import config from "./config.js";

document.body.onload = function() {
  let _firstName = document.querySelector("#firstName");
  let _lastName = document.querySelector("#lastName");
  let _email = document.querySelector("#email");
  let _mobileNumber = document.querySelector("#mobileNumber");
  let errors = document.querySelectorAll("P");
  let _firstNameError = errors[0];
  let _lastNameError = errors[1];
  let _emailError = errors[2];
  let _mobileNumberError = errors[3];
  for (let err of errors) {
    err.style.visibility = "hidden";
  }
  console.log(_firstNameError, _emailError);
  //   _firstName.oninvalid = function(e) {
  //     e.target.setCustomValidity("");
  //     if (!e.target.validity.valid) {
  //       e.target.setCustomValidity("This field cannot be left blank");
  //     }
  //   };
  //   _email.oninvalid = function(e) {
  //     e.target.setCustomValidity("");
  //     if (!e.target.validity.valid) {
  //       e.target.setCustomValidity("Please Enter a Valid Email");
  //     }
  //   };

  // Every time posts are updated Fetch them and call the printer
  fetch(`${config.endpoint}/customers`)
    .then(res => res.json())
    .then(data => printer(data));

  // Save posts into db.json
  let mainform = document.querySelector("#mainform");
  function mobilechecker() {
    if (isNaN(_mobileNumber.value)) {
      console.log("Wrong", _mobileNumber.value);
      _mobileNumber.setCustomValidity("Not A Valid Number");
      return true;
    }
  }

  mainform.addEventListener("submit", async function submitform(e) {
    e.preventDefault();
    if (mobilechecker()) {
      return false;
    }
    console.log("hi");
    let firstName = _firstName.value;
    let lastName = _lastName.value;
    let email = _email.value;
    let mobileNumber = _mobileNumber.value;
    let body = { firstName, lastName, email, mobileNumber };
    let createdCustomer = await saveCustomer(body);
    let customer = createdCustomer;
    let message = `
    id: ${customer.id}
    First Name : ${customer.firstName}
    Last Name : ${customer.lastName}
    Email : ${customer.email}
    Mobile : ${customer.mobileNumber}`;
  });

  // Print Customers from db.json
  function printer(customers) {
    for (let customer of customers) {
      let customerTable = document.querySelector("#customerTable");

      let newrow = document.createElement("tr");

      let firstName = document.createElement("td");
      firstName.textContent = customer.firstName;
      newrow.appendChild(firstName);

      let lastName = document.createElement("td");
      lastName.textContent = customer.lastName;
      newrow.appendChild(lastName);

      let mobileNumber = document.createElement("td");
      mobileNumber.textContent = customer.mobileNumber;
      newrow.appendChild(mobileNumber);

      let email = document.createElement("td");
      email.textContent = customer.email;
      newrow.appendChild(email);

      let action = document.createElement("td");
      let button = document.createElement("input");
      button.type = "submit";
      button.value = "X";
      button.name = "delete";
      button.id = "delete";
      button.className = "actionButton";
      // () fires immediately
      //   button.setAttribute("onclick", `deleteCustomer(${customer.id})`);    Why is this wrong?
      button.onclick = deleteCustomer.bind(null, customer.id);

      action.appendChild(button);

      newrow.appendChild(action);

      customerTable.appendChild(newrow);
    }
  }
};
