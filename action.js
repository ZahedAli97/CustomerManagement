import config from "./config.js";

export function saveCustomer(customer) {
  return fetch(`${config.endpoint}/customers`, {
    method: "POST",
    body: JSON.stringify(customer),
    headers: {
      "Content-Type": "application/json"
      // Noting the db that package is of type json
    }
  }).then(res => res.json());
}

// Deleting Customer using customer id
export function deleteCustomer(customerid) {
  console.log("From delete customer", customerid);
  return fetch(`${config.endpoint}/customers/${customerid}`, {
    method: "DELETE"
  }).then(res => res.json());
}
