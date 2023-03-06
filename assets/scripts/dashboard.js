const inputReview = document.getElementById("review-input");
const submitReview = document.getElementById("submit-review");

const reviewInputDiv = document.getElementById("user-reviews");
const feedbackInputDiv = document.getElementById("feedback-input");
const addFeedbackButton = document.getElementById("add-feedback-button");
// input - container;

var selectedReviewId;
var selfUserId = localStorage.getItem("userId");

function onFeedbackButtonClicked() {
    reviewInputDiv.style.display = "none";
    feedbackInputDiv.style.display = "inline-block";
}

const userCards = document.querySelectorAll(".user-card");
const contextMenu = document.querySelector(".contextmenu");
var selectedUserId;

userCards.forEach(card => {
    card.addEventListener("contextmenu", event => {
        event.preventDefault();
        const userId = event.target.dataset.userId;
        selectedUserId = userId;
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.classList.add("active");
    });
});

const updateButton = document.getElementById("update");
const addReview = document.getElementById("add-review");
const deleteUser = document.getElementById("delete-user");
const viewReviews = document.getElementById("view-reviews");

updateButton.addEventListener("click", event => {
    console.log(`update clicked on user ${selectedUserId}`);
});

addReview.addEventListener("click", event => {
    reviewInputDiv.style.display = "inline-block";
    feedbackInputDiv.style.display = "none";
});

deleteUser.addEventListener("click", event => {
    console.log(`delete clicked on user ${selectedUserId}`);
});

viewReviews.addEventListener("click", event => {
    console.log(`view review clicked on user ${selectedUserId}`);
});

submitReview.addEventListener("click", async event => {
    const review = inputReview.value;
    try {
        const response = await fetch(`/api/reviews/${selectedUserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ review, selfUserId }),
        });

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.log(error);
    }
});

window.addEventListener("click", function (event) {
    let contextmenu = document.querySelector(".contextmenu");
    contextmenu.classList.remove("active");
});

//Fetch all users
const getUsers = async () => {
    const employeesContainer = document.getElementsByClassName("user-list")[0];
    try {
        const response = await fetch("/api/employees", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        const userList = data.users;
        userList.forEach(user => {
            var userElement = document.createElement("div");
            userElement.classList.add("user-card");
            userElement.innerHTML = `
            <h5 data-user-id="${user._id}" class="user-name">
                ${user.firstname} ${user.lastname} ( ${user.role} )
            </h5>
            <h6 data-user-id="${user._id}" class="user-name">
                ${user.email}
            </h6>
        `;
            userElement.addEventListener("click", () => {
                userClicked();
            });
            userElement.addEventListener("contextmenu", event => {
                event.preventDefault();
                const employeeId = event.target.dataset.userId;
                selectedUserId = employeeId;
                contextMenu.style.top = `${event.pageY}px`;
                contextMenu.style.left = `${event.pageX}px`;
                contextMenu.classList.add("active");
            });
            employeesContainer.appendChild(userElement);
        });
    } catch (error) {
        console.log(error);
    }
};
getUsers();
