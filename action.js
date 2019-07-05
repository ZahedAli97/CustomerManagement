import config from "./config.js";

export function saveCustomer(customer) {
  return fetch(`${config.endpoint}/customers`, {
    method: "POST",
    body: JSON.stringify(customer),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
}

export function deleteCustomer(customerid) {
  console.log("From delete customer", customerid);
  return fetch(`${config.endpoint}/customers/${customerid}`, {
    method: "DELETE"
  }).then(res => res.json());
}
