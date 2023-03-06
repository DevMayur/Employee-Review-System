//Switch form
const signInForm = document.getElementsByClassName("signinForm")[0];
const signUpForm = document.getElementsByClassName("signupForm")[0];
const errorDiv = document.getElementsByClassName("error-div")[0];

function login() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    errorDiv.innerHTML = "";
}

function signup() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    errorDiv.innerHTML = "";
}

//Sign Up request

const firstName = document.getElementsByName("firstname")[0];
const lastname = document.getElementsByName("lastname")[0];
const email = document.getElementsByName("email")[0];
const password = document.getElementsByName("password")[0];
const confirmPassword = document.getElementsByName("confirmPassword")[0];
const submitButton = document.getElementsByName("registerUser")[0];

submitButton.addEventListener("click", event => {
    event.preventDefault();
    fetch("/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname: firstName.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            role: "employee",
        }),
    })
        .then(response => response.json())
        .then(data => {
            handleUserLoggenIn(data);
        });
});

//Sign IN request

const emailLogin = document.getElementsByName("email_login")[0];
const passwordLogin = document.getElementsByName("password_login")[0];
const submitButtonLogin = document.getElementsByName("submit_login")[0];

submitButtonLogin.addEventListener("click", event => {
    event.preventDefault();
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailLogin.value,
            password: passwordLogin.value,
        }),
    })
        .then(response => response.json())
        .then(data => {
            handleUserLoggenIn(data);
        });
});

function handleUserLoggenIn(data) {
    localStorage.setItem("userId", data.id);
    localStorage.setItem("email", data.email);
    localStorage.setItem("firstname", data.firstname);
    localStorage.setItem("lastname", data.lastname);
    localStorage.setItem("role", data.role);
    localStorage.setItem("token", data.token);
    if (data.success) {
        if (data.role == "admin") {
            window.location.href = "/api/adminDashboard";
        } else {
            window.location.href = "/api/dashboard";
        }
    } else {
        console.log(data.message);
        var element = `<h5 class='error'>
                                        ${data.message}
                                    </h5>`;

        errorDiv.innerHTML = element;
    }
}
