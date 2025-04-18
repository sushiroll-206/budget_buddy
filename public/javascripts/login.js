// Login page functionality
let loginOptions = [];

// Override the displayError function from utils.js
async function displayError() {
  showError("An error occurred. Please try again later.");
}

// Initialize the login page
async function initLogin() {
  // Check if user is already logged in
  try {
    const identityInfo = await fetchJSON(`api/${apiVersion}/users/myIdentity`);
    if (identityInfo.status === "loggedin") {
      // Redirect to dashboard if already logged in
      window.location.href = "index.html";
      return;
    }
  } catch (error) {
    console.error("Error checking identity:", error);
  }
  
  // Load login options
  await loadLoginOptions();
  
  // Set up event listeners
  setupEventListeners();
}

// Load login options from the server
async function loadLoginOptions() {
  try {
    const response = await fetchJSON(`api/${apiVersion}/auth/options`);
    loginOptions = response.options;
    
    // Display login options
    const loginOptionsContainer = document.getElementById("login-options");
    loginOptionsContainer.innerHTML = "";
    
    loginOptions.forEach(option => {
      const optionElement = document.createElement("div");
      optionElement.className = "flex items-center justify-center p-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer";
      optionElement.dataset.id = option.id;
      
      optionElement.innerHTML = `
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">${option.name}</h3>
          <p class="text-sm text-gray-500">${option.description}</p>
        </div>
      `;
      
      optionElement.addEventListener("click", () => showLoginForm(option.id));
      loginOptionsContainer.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Error loading login options:", error);
    showError("Failed to load login options. Please try again later.");
  }
}

// Show the appropriate login form based on the selected option
function showLoginForm(optionId) {
  // Hide all forms
  document.getElementById("login-options").classList.add("hidden");
  document.getElementById("uw-login-form").classList.add("hidden");
  document.getElementById("email-login-form").classList.add("hidden");
  document.getElementById("register-form").classList.add("hidden");
  
  // Show the selected form
  if (optionId === "uw") {
    document.getElementById("uw-login-form").classList.remove("hidden");
  } else if (optionId === "email") {
    document.getElementById("email-login-form").classList.remove("hidden");
  }
}

// Show the registration form
function showRegisterForm() {
  // Hide all forms
  document.getElementById("login-options").classList.add("hidden");
  document.getElementById("uw-login-form").classList.add("hidden");
  document.getElementById("email-login-form").classList.add("hidden");
  
  // Show the registration form
  document.getElementById("register-form").classList.remove("hidden");
}

// Go back to login options
function backToOptions() {
  // Hide all forms
  document.getElementById("uw-login-form").classList.add("hidden");
  document.getElementById("email-login-form").classList.add("hidden");
  document.getElementById("register-form").classList.add("hidden");
  
  // Show login options
  document.getElementById("login-options").classList.remove("hidden");
}

// Go back to email login form
function backToEmailLogin() {
  // Hide all forms
  document.getElementById("login-options").classList.add("hidden");
  document.getElementById("uw-login-form").classList.add("hidden");
  document.getElementById("register-form").classList.add("hidden");
  
  // Show email login form
  document.getElementById("email-login-form").classList.remove("hidden");
}

// Handle email/password login
async function handleEmailLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!email || !password) {
    showError("Please enter both email and password");
    return;
  }
  
  try {
    const response = await fetch(`api/${apiVersion}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Redirect to dashboard on successful login
      window.location.href = "index.html";
    } else {
      showError(data.error || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred during login. Please try again later.");
  }
}

// Handle user registration
async function handleRegistration() {
  const firstName = document.getElementById("reg-firstName").value;
  const lastName = document.getElementById("reg-lastName").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  
  if (!firstName || !lastName || !email || !password) {
    showError("Please fill in all fields");
    return;
  }
  
  try {
    const response = await fetch(`api/${apiVersion}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Redirect to dashboard on successful registration
      window.location.href = "index.html";
    } else {
      showError(data.error || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    showError("An error occurred during registration. Please try again later.");
  }
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  
  errorText.textContent = message;
  errorElement.classList.remove("hidden");
  
  // Hide error after 5 seconds
  setTimeout(() => {
    errorElement.classList.add("hidden");
  }, 5000);
}

// Set up event listeners
function setupEventListeners() {
  // UW NetID login button
  document.getElementById("uw-login-btn").addEventListener("click", () => {
    window.location.href = "signin";
  });
  
  // Back to options buttons
  document.getElementById("back-to-options-uw").addEventListener("click", backToOptions);
  document.getElementById("back-to-options-email").addEventListener("click", backToOptions);
  
  // Show register form button
  document.getElementById("show-register").addEventListener("click", showRegisterForm);
  
  // Back to login button
  document.getElementById("back-to-login").addEventListener("click", backToEmailLogin);
  
  // Email login button
  document.getElementById("email-login-btn").addEventListener("click", handleEmailLogin);
  
  // Register button
  document.getElementById("register-btn").addEventListener("click", handleRegistration);
  
  // Add enter key support for forms
  document.getElementById("email").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  });
  
  document.getElementById("password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  });
  
  document.getElementById("reg-firstName").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleRegistration();
    }
  });
  
  document.getElementById("reg-lastName").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleRegistration();
    }
  });
  
  document.getElementById("reg-email").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleRegistration();
    }
  });
  
  document.getElementById("reg-password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleRegistration();
    }
  });
} 