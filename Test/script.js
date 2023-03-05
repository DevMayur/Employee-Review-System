const inputReview = document.getElementById("review-input");
const submitReview = document.getElementById("submit-review");

const reviewInputDiv = document.getElementById("user-reviews");
const feedbackInputDiv = document.getElementById("feedback-input");
const addFeedbackButton = document.getElementById("add-feedback-button");

var selectedEmployeeId;
var selectedReviewId;

function userClicked() {
    reviewInputDiv.style.display = "inline-block";
    feedbackInputDiv.style.display = "none";
}

function onFeedbackButtonClicked() {
    reviewInputDiv.style.display = "none";
    feedbackInputDiv.style.display = "inline-block";
}

const userCards = document.querySelectorAll(".user-card");
const contextMenu = document.querySelector(".contextmenu");

userCards.forEach(card => {
    card.addEventListener("contextmenu", event => {
        event.preventDefault();
        const userId = event.target.dataset.userId;
        console.log(userId);
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.classList.add("active");
    });
});

window.addEventListener("click", function (event) {
    let contextmenu = document.querySelector(".contextmenu");
    contextmenu.classList.remove("active");
});
