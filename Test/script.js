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
