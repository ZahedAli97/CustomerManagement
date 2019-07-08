import { saveCustomer, deleteCustomer } from "./action.js";
import config from "./config.js";

document.body.onload = function() {
  // Input Elements
  let _firstName = document.querySelector("#firstName");
  let _lastName = document.querySelector("#lastName");
  let _email = document.querySelector("#email");
  let _mobileNumber = document.querySelector("#mobileNumber");

  // Div's for adding error alert
  let _firstNameError = document.querySelector("#nameerror");
  let _emailError = document.querySelector("#emailerror");
  let _mobileError = document.querySelector("#mobileerror");
  let _catcher = document.querySelector("#catcherdiv");

  // Every time posts are updated Fetch them and call the printer
  fetch(`${config.endpoint}/customers`)
    .then(res => res.json())
    .then(data => printer(data))
    .catch(err => {
      let h1 = document.createElement("h1");
      h1.textContent = "OOPS! Looks Like the Data Base is asleep.";
      h1.color = "white";
      h1.className = "text-center";
      _catcher.appendChild(h1);
    });

  // Save posts into db.json
  let mainform = document.querySelector("#mainform");

  function selfvalidation(namevalue, emailvalue, mobilevalue) {
    function firstNamechecker() {
      if (namevalue == "") {
        //If name is empty
        return "No";
      }
      return "Yes";
    }
    function emailchecker() {
      if (!_email.checkValidity()) {
        // checkValidity by html type="email"
        //
        return "No";
      }
      return "Yes";
    }
    function mobilechecker() {
      if (
        isNaN(mobilevalue) ||
        mobilevalue.length != 10 ||
        mobilevalue == "" ||
        mobilevalue < 0
      ) {
        console.log(
          isNaN(mobilevalue),
          mobilevalue.length != 10,
          mobilevalue == ""
        );
        return "No";
      }
      return "Yes";
    }

    let notname = firstNamechecker();
    let notemail = emailchecker();
    let notmobile = mobilechecker();

    // Display Warnings and Errors fro 3 Seconds
    // For Name
    if (notname === "No") {
      if (_firstNameError.children.length === 0) {
        let p = document.createElement("P");
        p.textContent = "'First Name is Required.'";
        p.style.color = "#FFEB00";
        _firstNameError.appendChild(p);
      }
      setTimeout(function() {
        _firstNameError.removeChild(_firstNameError.childNodes[0]);
      }, 3000);
    }
    // For Email
    if (notemail === "No") {
      if (emailvalue === "") {
        if (_emailError.children.length === 0) {
          let p = document.createElement("P");
          p.textContent = "'Email is Required.'";
          p.style.color = "#FFEB00";
          _emailError.appendChild(p);
        }
      } else {
        if (_emailError.children.length === 0) {
          let p = document.createElement("P");
          p.textContent = "'Not a Valid Email.'";
          p.style.color = "#FFEB00";
          _emailError.appendChild(p);
        }
      }
      setTimeout(function() {
        _emailError.removeChild(_emailError.childNodes[0]);
      }, 3000);
    }
    // For Mobile Number
    if (notmobile === "No") {
      if (mobilevalue == "") {
        if (_mobileError.children.length === 0) {
          let p = document.createElement("P");
          p.textContent = "'Mobile Number is Required.'";
          p.style.color = "#FFEB00";
          _mobileError.appendChild(p);
        }
      } else {
        if (_mobileError.children.length === 0) {
          let p = document.createElement("P");
          p.textContent = "'Not a Valid Mobile Number.'";
          p.style.color = "#FFEB00";
          _mobileError.appendChild(p);
        }
      }
      setTimeout(function() {
        _mobileError.removeChild(_mobileError.childNodes[0]);
      }, 3000);
    }

    if (notname === "No" || notemail === "No" || notmobile === "No") {
      return false;
    } else {
      return true;
    }
  }

  mainform.addEventListener("submit", async function submitform(e) {
    e.preventDefault();

    if (e.type === "submit") {
      // Just Confirming Submit Action
      let validation = selfvalidation(
        _firstName.value,
        _email.value,
        _mobileNumber.value
      );

      if (!validation) {
        return;
      }
    }

    let firstName = _firstName.value;
    let lastName = _lastName.value;
    let email = _email.value;
    let mobileNumber = _mobileNumber.value;
    let body = { firstName, lastName, email, mobileNumber }; // Body for Posting in db
    let createdCustomer = await saveCustomer(body);
    let customer = createdCustomer;
    // Response is `
    // id: ${customer.id}
    // First Name : ${customer.firstName}
    // Last Name : ${customer.lastName}
    // Email : ${customer.email}
    // Mobile : ${customer.mobileNumber}`;
  });

  // Ask user and confirm - confirm() : alert with cancel
  function askdeleteCustomer(customerid, customerfirstname, customerlastname) {
    if (
      confirm(
        `Are you sure you want to delete customer: ${customerfirstname} ${customerlastname}?`
      )
    ) {
      let data = deleteCustomer(customerid);
    } else {
      return;
    }
  }

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
      button.style.backgroundColor = "dimgrey";
      button.style.color = "white";
      button.className = "actionButton";
      button.classList.add("bg-dark");

      // () fires immediately
      //   button.setAttribute("onclick", `deleteCustomer(${customer.id})`);    Why is this wrong?
      button.onclick = askdeleteCustomer.bind(
        null,
        customer.id,
        customer.firstName,
        customer.lastName
      );

      action.appendChild(button);

      newrow.appendChild(action);

      customerTable.appendChild(newrow);
    }
  }
};
