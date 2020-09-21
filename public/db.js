let db;
// Create a new request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // Create an object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  // This checks if the app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// Send a message if there is an error
request.onerror = function (event) {
  console.log("Something went wrong! " + event.target.errorCode);
};

function saveRecord(record) {
  // Create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // Access the pending object store
  const store = transaction.objectStore("pending");

  // Add record to the store with the add method
  store.add(record);
}

function checkDatabase() {
  // Open a transaction on the pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // Access the pending object store
  const store = transaction.objectStore("pending");
  // Get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // If successful, open a transaction on the pending db
          const transaction = db.transaction(["pending"], "readwrite");

          // Access the pending object store
          const store = transaction.objectStore("pending");

          // Clear all items in the store
          store.clear();
        });
    }
  };
}

// Prevents having two records when coming back online
function deletePending() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.clear();
}

// Add a listener for the app coming back online
window.addEventListener("online", checkDatabase);
