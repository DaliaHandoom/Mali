const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("show");
  });
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserEmail() {
  let email = localStorage.getItem("currentUserEmail");
  if (!email) {
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    if (profile && profile.email) {
      email = profile.email;
      localStorage.setItem("currentUserEmail", email);
    }
  }
  return email;
}

function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem("currentUserEmail", email);
  } else {
    localStorage.removeItem("currentUserEmail");
  }
}

function getCurrentUserProfile() {
  const email = getCurrentUserEmail();
  if (email) {
    const users = getUsers();
    if (users[email]) {
      return users[email];
    }
  }

  const fallback = JSON.parse(localStorage.getItem("userProfile"));
  if (fallback && fallback.email) {
    setCurrentUserEmail(fallback.email);
    return fallback;
  }
  return null;
}

function setCurrentUserProfile(profile) {
  const users = getUsers();
  users[profile.email] = profile;
  setUsers(users);
  localStorage.setItem("userProfile", JSON.stringify(profile));
  setCurrentUserEmail(profile.email);
}

function getExpensesKey(email) {
  return `expenses_${email}`;
}

function getCurrentExpenses() {
  const email = getCurrentUserEmail();
  if (!email) return [];
  return JSON.parse(localStorage.getItem(getExpensesKey(email))) || [];
}

function setCurrentExpenses(expenses) {
  const email = getCurrentUserEmail();
  if (!email) return;
  localStorage.setItem(getExpensesKey(email), JSON.stringify(expenses));
}

/* Protected Links */
const protectedLinks = document.querySelectorAll(".protected-link");

protectedLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (!localStorage.getItem("isLoggedIn")) {
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

/* Review Form */
function addReview() {
  const nameInput = document.getElementById("userName");
  const reviewInput = document.getElementById("userReview");
  const reviewStatus = document.getElementById("reviewStatus");
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!nameInput || !reviewInput) return;

  if (!isLoggedIn) {
    if (reviewStatus) {
      reviewStatus.textContent = "Please login or register to submit a review.";
    }
    alert("Please login or register to submit a review.");
    window.location.href = "login.html";
    return;
  }

  const name = nameInput.value.trim();
  const review = reviewInput.value.trim();

  if (!name || !review) {
    alert("Please fill all fields");
    return;
  }

  const reviewsContainer = document.querySelector(".reviews");
  if (!reviewsContainer) return;

  const newReview = document.createElement("div");
  newReview.classList.add("review-card");

  newReview.innerHTML = `
    <p>"${review}"</p>
    <span>— ${name}</span>
  `;

  reviewsContainer.appendChild(newReview);

  nameInput.value = "";
  reviewInput.value = "";
}

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

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const language = document.getElementById("language");
    const message = document.getElementById("message");

    const isFirstNameValid = validateName(firstName, "First name");
    const isLastNameValid = validateName(lastName, "Last name");
    const isMobileValid = validateMobile(mobile);
    const isEmailValid = validateEmail(email);
    const isLanguageValid = validateLanguage(language);
    const isMessageValid = validateMessage(message);

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isMobileValid &&
      isEmailValid &&
      isLanguageValid &&
      isMessageValid
    ) {
      formStatus.textContent = "Form submitted successfully!";
      contactForm.reset();
    } else {
      formStatus.textContent = "";
    }
  });
}

/* Register / Get Started */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerStatus = document.getElementById("registerStatus");

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mobile = document.getElementById("registerMobile").value.trim();
    const income = document.getElementById("monthlyIncome").value.trim();
    const ageRange = document.getElementById("ageRange").value;
    const password = document.getElementById("registerPassword").value.trim();

    if (
      name === "" ||
      email === "" ||
      mobile === "" ||
      income === "" ||
      ageRange === "" ||
      password === ""
    ) {
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

    if (Number(income) <= 0) {
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

    const users = getUsers();
    if (users[email]) {
      registerStatus.textContent = "An account already exists. Please login.";
      return;
    }

    const userProfile = {
      name: name,
      email: email,
      mobile: mobile,
      monthlyIncome: Number(income),
      ageRange: ageRange,
      status: selectedStatus,
      password: password
    };

    setCurrentUserProfile(userProfile);
    localStorage.setItem("isLoggedIn", "true");

    registerStatus.textContent = "Account created successfully!";

    setTimeout(function () {
      window.location.href = "expenses.html";
    }, 800);
  });
}

/* Login Form */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginStatus = document.getElementById("loginStatus");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const users = getUsers();
    const userProfile = users[email];

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

    if (!userProfile) {
      loginStatus.textContent = "No account found. Please register first.";
      return;
    }

    if (password !== userProfile.password) {
      loginStatus.textContent = "Email or password is incorrect.";
      return;
    }

    setCurrentUserProfile(userProfile);
    localStorage.setItem("isLoggedIn", "true");

    loginStatus.textContent = "Login successful!";

    setTimeout(function () {
      window.location.href = "expenses.html";
    }, 800);
  });
}

/* Add Expense Form */
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

  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value.trim();
    const categorySelect = document.getElementById("category");
    let category = categorySelect.value;
    const otherCategoryInput = document.getElementById("otherCategory");
    const date = document.getElementById("expenseDate").value;
    const note = document.getElementById("note").value.trim();

    if (amount === "" || Number(amount) <= 0) {
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

    const expense = {
      amount: Number(amount),
      category: category,
      date: date,
      note: note
    };

    const expenses = getCurrentExpenses();
    expenses.push(expense);
    setCurrentExpenses(expenses);

    expenseStatus.textContent = "Expense added successfully!";
    expenseForm.reset();

    if (otherCategoryGroup) {
      otherCategoryGroup.style.display = "none";
      otherCategoryField.removeAttribute("required");
      otherCategoryField.value = "";
    }
  });
}

/* View Report Page */
const reportList = document.getElementById("reportList");

if (reportList) {
  function renderReport() {
    const expenses = getCurrentExpenses();
    const userProfile = getCurrentUserProfile();

    let income = 0;

    if (userProfile && userProfile.monthlyIncome) {
      income = Number(userProfile.monthlyIncome);
      if (isNaN(income)) {
        income = 0;
      }
    }

    let totalExpenses = 0;
    const categories = {};

    expenses.forEach(function (expense) {
      const amount = Number(expense.amount);
      if (!isNaN(amount) && amount > 0) {
        totalExpenses += amount;

        if (!categories[expense.category]) {
          categories[expense.category] = 0;
        }

        categories[expense.category] += amount;
      }
    });

    const balance = income - totalExpenses;

    document.getElementById("reportIncome").textContent = income + " SAR";
    document.getElementById("reportExpenses").textContent = totalExpenses + " SAR";
    document.getElementById("reportBalance").textContent = balance + " SAR";

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
      return;
    }

    reportList.innerHTML = "";

    expenses.forEach(function (expense, index) {
      const item = document.createElement("div");
      item.classList.add("info-item");

      item.innerHTML = `
        <div class="info-item-content">
          <div>
            <h3>${expense.category}</h3>
            <p><strong>Amount:</strong> ${expense.amount} SAR</p>
            <p><strong>Date:</strong> ${expense.date}</p>
            <p><strong>Note:</strong> ${expense.note || "No note added"}</p>
          </div>
        </div>
        <button type="button" class="btn delete-btn" data-index="${index}">Delete</button>
      `;

      reportList.appendChild(item);
    });

    const deleteButtons = reportList.querySelectorAll(".delete-btn");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const deleteIndex = Number(this.getAttribute("data-index"));
        const updatedExpenses = expenses.filter(function (_, idx) {
          return idx !== deleteIndex;
        });
        setCurrentExpenses(updatedExpenses);
        renderReport();
      });
    });
  }

  const clearReportButton = document.getElementById("clearReportButton");
  if (clearReportButton) {
    clearReportButton.addEventListener("click", function () {
      setCurrentExpenses([]);
      renderReport();
    });
  }

  renderReport();
}

/* Logout */
function logout() {
  localStorage.removeItem("isLoggedIn");
  setCurrentUserEmail("");
  window.location.href = "login.html";
}