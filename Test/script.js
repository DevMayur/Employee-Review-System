const inputReview = document.getElementById("review-input");
const submitReview = document.getElementById("submit-review");

const reviewInputDiv = document.getElementById("user-reviews");
const feedbackInputDiv = document.getElementById("feedback-input");
const addFeedbackButton = document.getElementById("add-feedback-button");

var selectedEmployeeId;
var selectedReviewId;

function userClicked() {}

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
        console.log(userId);
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

window.addEventListener("click", function (event) {
    let contextmenu = document.querySelector(".contextmenu");
    contextmenu.classList.remove("active");
});
