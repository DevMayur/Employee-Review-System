const createUserButton = document.getElementsByName("createUser")[0];

const firstName = document.getElementsByName("firstname")[0];
const lastname = document.getElementsByName("lastname")[0];
const email = document.getElementsByName("email")[0];
const password = document.getElementsByName("password")[0];
const confirmPassword = document.getElementsByName("confirmPassword")[0];
const submitButton = document.getElementsByName("registerUser")[0];
createUserButton.addEventListener("click", event => {
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
            history.back();
        });
});
