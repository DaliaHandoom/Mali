import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALfNIX5fpVr2_vca8-lhTJCGvIi8cCxFg",
  authDomain: "mali-bc9c5.firebaseapp.com",
  projectId: "mali-bc9c5",
  storageBucket: "mali-bc9c5.firebasestorage.app",
  messagingSenderId: "972332984504",
  appId: "1:972332984504:web:8aeabd02bbe7320a40ec4d",
  measurementId: "G-R4H1Z6R4H4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("show");
  });
}

document.querySelectorAll('input[type="number"]').forEach(function (input) {
  input.addEventListener("wheel", function (event) {
    event.preventDefault();
    input.blur();
  });
});

function getCurrentUserId() {
  return localStorage.getItem("userId");
}

function getCurrentUserProfile() {
  return JSON.parse(localStorage.getItem("userProfile")) || null;
}

function setCurrentUserProfile(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

function formatMoney(value) {
  const number = parseFloat(value) || 0;
  return number % 1 === 0 ? number.toFixed(0) : number.toFixed(2);
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("userProfile");
  window.location.href = "login.html";
}

window.logout = logout;

/* Protected Links */
document.querySelectorAll(".protected-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (!localStorage.getItem("userId")) {
      event.preventDefault();
      window.location.href = "login.html";
    }
  });
});

/* Status Buttons */
const statusButtons = document.querySelectorAll(".status-btn");
let selectedStatus = "";

statusButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    statusButtons.forEach(function (button) {
      button.classList.remove("active");
    });

    btn.classList.add("active");
    selectedStatus = btn.textContent.trim();
  });
});

/* Reviews */
async function addReview() {
  const nameInput = document.getElementById("userName");
  const reviewInput = document.getElementById("userReview");
  const reviewStatus = document.getElementById("reviewStatus");

  if (!nameInput || !reviewInput || !reviewStatus) return;

  const name = nameInput.value.trim();
  const review = reviewInput.value.trim();

  if (!name || !review) {
    reviewStatus.textContent = "Please fill all fields.";
    return;
  }

  try {
    await addDoc(collection(db, "reviews"), {
      name: name,
      review: review
    });

    reviewStatus.textContent = "Review added successfully.";
    nameInput.value = "";
    reviewInput.value = "";
    loadReviews();
  } catch (error) {
    reviewStatus.textContent = "Error adding review.";
  }
}

window.addReview = addReview;

async function loadReviews() {
  const reviewsContainer = document.getElementById("reviewsContainer");
  if (!reviewsContainer) return;

  try {
    const snapshot = await getDocs(collection(db, "reviews"));
    reviewsContainer.innerHTML = "";

    if (snapshot.empty) {
      reviewsContainer.innerHTML = `
        <div class="review-card">
          <p>“Mali helped me understand where my money goes every month.”</p>
          <span>— Sarah</span>
        </div>
        <div class="review-card">
          <p>“The best way to track my expenses. Simple and useful!”</p>
          <span>— Ahmed</span>
        </div>
        <div class="review-card">
          <p>“I started saving more after using Mali. Highly recommended.”</p>
          <span>— Layan</span>
        </div>
      `;
      return;
    }

    snapshot.forEach(function (docSnap) {
      const item = docSnap.data();

      const reviewCard = document.createElement("div");
      reviewCard.classList.add("review-card");

      reviewCard.innerHTML = `
        <p>"${item.review}"</p>
        <span>— ${item.name}</span>
      `;

      reviewsContainer.appendChild(reviewCard);
    });
  } catch (error) {
    reviewsContainer.innerHTML = "<p>Could not load reviews.</p>";
  }
}

loadReviews();

/* Contact Form */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const formStatus = document.getElementById("formStatus");

  const showError = function (input, message) {
    const formGroup = input.closest(".form-group");
    const errorElement = formGroup.querySelector(".error-message");

    input.classList.add("input-error");
    errorElement.textContent = message;
  };

  const clearError = function (input) {
    const formGroup = input.closest(".form-group");
    const errorElement = formGroup.querySelector(".error-message");

    input.classList.remove("input-error");
    errorElement.textContent = "";
  };

  const validateName = function (input, fieldName) {
    const value = input.value.trim();
    const namePattern = /^[A-Za-z\s]{2,30}$/;

    if (value === "") {
      showError(input, `${fieldName} is required.`);
      return false;
    }

    if (!namePattern.test(value)) {
      showError(input, `${fieldName} must contain only letters and be 2 to 30 characters.`);
      return false;
    }

    clearError(input);
    return true;
  };

  const validateMobile = function (input) {
    const value = input.value.trim();
    const mobilePattern = /^05[0-9]{8}$/;

    if (value === "") {
      showError(input, "Mobile number is required.");
      return false;
    }

    if (!mobilePattern.test(value)) {
      showError(input, "Mobile number must start with 05 and contain 10 digits.");
      return false;
    }

    clearError(input);
    return true;
  };

  const validateEmail = function (input) {
    const value = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
      showError(input, "Email address is required.");
      return false;
    }

    if (!emailPattern.test(value)) {
      showError(input, "Please enter a valid email address.");
      return false;
    }

    clearError(input);
    return true;
  };

  const validateLanguage = function (input) {
    if (input.value === "") {
      showError(input, "Please select a language.");
      return false;
    }

    clearError(input);
    return true;
  };

  const validateMessage = function (input) {
    const value = input.value.trim();

    if (value === "") {
      showError(input, "Message is required.");
      return false;
    }

    if (value.length < 10) {
      showError(input, "Message must be at least 10 characters.");
      return false;
    }

    if (value.length > 300) {
      showError(input, "Message must not exceed 300 characters.");
      return false;
    }

    clearError(input);
    return true;
  };

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const language = document.getElementById("language");
    const message = document.getElementById("message");

    const isValid =
      validateName(firstName, "First name") &&
      validateName(lastName, "Last name") &&
      validateMobile(mobile) &&
      validateEmail(email) &&
      validateLanguage(language) &&
      validateMessage(message);

    if (!isValid) {
      formStatus.textContent = "";
      return;
    }

    try {
      await addDoc(collection(db, "contacts"), {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        mobile: mobile.value.trim(),
        email: email.value.trim(),
        language: language.value,
        message: message.value.trim()
      });

      formStatus.textContent = "Message sent successfully.";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = "Error sending message.";
    }
  });
}

/* Register */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerStatus = document.getElementById("registerStatus");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mobile = document.getElementById("registerMobile").value.trim();
    const income = document.getElementById("monthlyIncome").value.trim();
    const ageRange = document.getElementById("ageRange").value;
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !mobile || !income || !ageRange || !password) {
      registerStatus.textContent = "Please fill in all fields.";
      return;
    }

    if (!/^[A-Za-z\s]{2,30}$/.test(name)) {
      registerStatus.textContent = "Name must contain only letters and be 2 to 30 characters.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      registerStatus.textContent = "Please enter a valid email address.";
      return;
    }

    if (!/^05[0-9]{8}$/.test(mobile)) {
      registerStatus.textContent = "Mobile number must start with 05 and contain 10 digits.";
      return;
    }

    if (parseFloat(income) <= 0) {
      registerStatus.textContent = "Monthly income must be greater than 0.";
      return;
    }

    if (password.length < 6) {
      registerStatus.textContent = "Password must be at least 6 characters.";
      return;
    }

    if (selectedStatus === "") {
      registerStatus.textContent = "Please select your status.";
      return;
    }

    try {
      const usersQuery = query(collection(db, "users"), where("email", "==", email));
      const usersSnapshot = await getDocs(usersQuery);

      if (!usersSnapshot.empty) {
        registerStatus.textContent = "This email is already registered.";
        return;
      }

      const userProfile = {
        name: name,
        email: email,
        mobile: mobile,
        monthlyIncome: parseFloat(income),
        ageRange: ageRange,
        status: selectedStatus,
        password: password
      };

      const docRef = await addDoc(collection(db, "users"), userProfile);

      userProfile.id = docRef.id;

      localStorage.setItem("userId", docRef.id);
      localStorage.setItem("isLoggedIn", "true");
      setCurrentUserProfile(userProfile);

      registerStatus.textContent = "Account created successfully.";

      setTimeout(function () {
        window.location.href = "expenses.html";
      }, 800);
    } catch (error) {
      registerStatus.textContent = "Error creating account.";
    }
  });
}

/* Login */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginStatus = document.getElementById("loginStatus");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "") {
      loginStatus.textContent = "Email address is required.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      loginStatus.textContent = "Please enter a valid email address.";
      return;
    }

    if (password === "") {
      loginStatus.textContent = "Password is required.";
      return;
    }

    if (password.length < 6) {
      loginStatus.textContent = "Password must be at least 6 characters.";
      return;
    }

    try {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        loginStatus.textContent = "Invalid email or password.";
        return;
      }

      let userProfile = null;
      let userId = "";

      usersSnapshot.forEach(function (docSnap) {
        userId = docSnap.id;
        userProfile = docSnap.data();
      });

      userProfile.id = userId;

      localStorage.setItem("userId", userId);
      localStorage.setItem("isLoggedIn", "true");
      setCurrentUserProfile(userProfile);

      loginStatus.textContent = "Login successful.";

      setTimeout(function () {
        window.location.href = "expenses.html";
      }, 800);
    } catch (error) {
      loginStatus.textContent = "Error logging in.";
    }
  });
}

/* Expenses */
const expenseForm = document.getElementById("expenseForm");

if (expenseForm) {
  const expenseStatus = document.getElementById("expenseStatus");
  const categoryField = document.getElementById("category");
  const otherCategoryField = document.getElementById("otherCategory");
  const otherCategoryGroup = document.getElementById("otherCategoryGroup");

  if (categoryField && otherCategoryField && otherCategoryGroup) {
    categoryField.addEventListener("change", function () {
      if (this.value === "Other") {
        otherCategoryGroup.style.display = "block";
        otherCategoryField.setAttribute("required", "required");
      } else {
        otherCategoryGroup.style.display = "none";
        otherCategoryField.removeAttribute("required");
        otherCategoryField.value = "";
      }
    });
  }

  expenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = getCurrentUserId();

    if (!userId) {
      window.location.href = "login.html";
      return;
    }

    const amount = document.getElementById("amount").value.trim();
    const categorySelect = document.getElementById("category");
    let category = categorySelect.value;
    const otherCategoryInput = document.getElementById("otherCategory");
    const date = document.getElementById("expenseDate").value;
    const note = document.getElementById("note").value.trim();

    const expenseAmount = parseFloat(amount);

    if (amount === "" || isNaN(expenseAmount) || expenseAmount <= 0) {
      expenseStatus.textContent = "Please enter a valid amount greater than 0.";
      return;
    }

    if (category === "") {
      expenseStatus.textContent = "Please select a category.";
      return;
    }

    if (category === "Other") {
      const otherValue = otherCategoryInput.value.trim();

      if (otherValue === "") {
        expenseStatus.textContent = "Please enter a custom category for Other.";
        return;
      }

      category = otherValue;
    }

    if (date === "") {
      expenseStatus.textContent = "Please select a date.";
      return;
    }

    if (note.length > 200) {
      expenseStatus.textContent = "Note must not exceed 200 characters.";
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        amount: expenseAmount,
        category: category,
        date: date,
        note: note,
        userId: userId
      });

      expenseStatus.textContent = "Expense added successfully.";
      expenseForm.reset();

      if (otherCategoryGroup) {
        otherCategoryGroup.style.display = "none";
        otherCategoryField.removeAttribute("required");
        otherCategoryField.value = "";
      }
    } catch (error) {
      expenseStatus.textContent = "Error adding expense.";
    }
  });
}

/* Report */
const reportList = document.getElementById("reportList");

async function loadReport() {
  const userId = getCurrentUserId();

  if (!reportList) return;

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  try {
    const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));
    const expensesSnapshot = await getDocs(expensesQuery);

    const expenses = [];

    expensesSnapshot.forEach(function (docSnap) {
      const expense = docSnap.data();
      expense.id = docSnap.id;
      expenses.push(expense);
    });

    const userProfile = getCurrentUserProfile();

    let income = 0;

    if (userProfile && userProfile.monthlyIncome) {
      income = parseFloat(userProfile.monthlyIncome);
    }

    let totalExpenses = 0;
    const categories = {};

    expenses.forEach(function (expense) {
      const amount = parseFloat(expense.amount) || 0;
      totalExpenses += amount;

      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }

      categories[expense.category] += amount;
    });

    const balance = income - totalExpenses;

    document.getElementById("reportIncome").textContent = formatMoney(income) + " SAR";
    document.getElementById("reportExpenses").textContent = formatMoney(totalExpenses) + " SAR";
    document.getElementById("reportBalance").textContent = formatMoney(balance) + " SAR";

    let highestCategory = "No data yet";
    let highestAmount = 0;

    for (let category in categories) {
      if (categories[category] > highestAmount) {
        highestAmount = categories[category];
        highestCategory = category;
      }
    }

    document.getElementById("reportCategory").textContent = highestCategory;

    if (expenses.length === 0) {
      reportList.innerHTML = "<p>No expenses have been added yet.</p>";
    } else {
      reportList.innerHTML = "";

      expenses.forEach(function (expense) {
        const item = document.createElement("div");
        item.classList.add("info-item");

        item.innerHTML = `
          <h3>${expense.category}</h3>
          <p><strong>Amount:</strong> ${formatMoney(expense.amount)} SAR</p>
          <p><strong>Date:</strong> ${expense.date || "No date"}</p>
          <p><strong>Note:</strong> ${expense.note || "No note added"}</p>
        `;

        reportList.appendChild(item);
      });
    }
  } catch (error) {
    reportList.innerHTML = "<p>Could not load report data.</p>";
  }
}

if (reportList) {
  loadReport();
}

/* Navbar Auth UI */
const guestItems = document.querySelectorAll(".guest-only");
const userItems = document.querySelectorAll(".user-only");

if (localStorage.getItem("userId") && localStorage.getItem("isLoggedIn") === "true") {
  guestItems.forEach(item => item.style.display = "none");
  userItems.forEach(item => item.style.display = "inline-flex");
} else {
  guestItems.forEach(item => item.style.display = "inline-flex");
  userItems.forEach(item => item.style.display = "none");
}

/* Clear Report */
const clearReportButton = document.getElementById("clearReportButton");

if (clearReportButton) {
  clearReportButton.addEventListener("click", async function () {
    const userId = getCurrentUserId();

    if (!userId) {
      window.location.href = "login.html";
      return;
    }

    try {
      const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));
      const expensesSnapshot = await getDocs(expensesQuery);

      const deletePromises = [];

      expensesSnapshot.forEach(function (docSnap) {
        deletePromises.push(deleteDoc(doc(db, "expenses", docSnap.id)));
      });

      await Promise.all(deletePromises);

      alert("Report cleared successfully.");
      loadReport();
    } catch (error) {
      alert("Error clearing report.");
    }
  });
}