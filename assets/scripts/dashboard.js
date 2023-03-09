const inputReview = document.getElementById("review-input");
const submitReview = document.getElementById("submit-review");
// const assignReviewButton = document.getElementById("assign-button");

const reviewInputDiv = document.getElementById("user-reviews");
const feedbackInputDiv = document.getElementById("feedback-input");
const assignReviewDiv = document.getElementById("assign-review-div");
const addFeedbackButton = document.getElementById("add-feedback-button");
const showReviews = document.getElementById("view-reviews");
// input - container;

var selectedReviewId;
var selfUserId = localStorage.getItem("userId");

function showReviewsAssigned() {
    reviewInputDiv.style.display = "none";
    feedbackInputDiv.style.display = "none";
    assignReviewDiv.style.display = "inline-block";
}

async function assignUserReview(reviewTo, reviewBy) {
    try {
        const response = await fetch(`/api/assignReviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewTo,
                reviewBy,
            }),
        });

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

function onFeedbackButtonClicked(reviewId, reviewBy) {
    reviewInputDiv.style.display = "none";
    feedbackInputDiv.style.display = "inline-block";
    const feedbackBlockTitle = document.getElementById("feedback-title");
    feedbackBlockTitle.innerHTML = `Add Feedback on ${reviewBy}'s review`;
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
const assignReview = document.getElementById("assign-review");

updateButton.addEventListener("click", event => {
    console.log(`update clicked on user ${selectedUserId}`);
});

addReview.addEventListener("click", event => {
    console.log("##############");
    reviewInputDiv.style.display = "inline-block";
    feedbackInputDiv.style.display = "none";
    assignReviewDiv.style.display = "none";
});

deleteUser.addEventListener("click", async event => {
    const response = await fetch(`/api/employees/${selectedUserId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    console.log(data);
});

viewReviews.addEventListener("click", async event => {
    console.log(`view review clicked on user ${selectedUserId}`);
    const response = await fetch(`/api/reviews/${selectedUserId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    viewReviews.style.display = "inline-block";
    // assignReviewDiv.style.display = "none";

    const data = await response.json();
    console.log(data);

    var htmlData = "";
    const reviewsContainer =
        document.getElementsByClassName("reviews-list-div")[0];
    reviewsContainer.innerHTML = "";
    data.forEach(review => {
        var reviewElement = document.createElement("div");
        // reviewElement.classList.add("review-card");
        reviewElement.innerHTML = `<div class="review-card">
        <div class="user-header">
            <h5 class="user-header-h5 user-name text-on-light">
                ${review.sender.firstname} ${review.sender.lastname}
            </h5>
            <p class="user-header-h5 user-name text-on-light">
                ${review.review}
            </p>
            <div class="feedback-status">
                <i class="fa fa-plus input-icon-small"></i>
                <input
                    id="add-feedback-button"
                    class="feedback-button"
                    type="button"
                    onclick="onFeedbackButtonClicked('${review._id}' , '${review.sender.firstname} ${review.sender.lastname}')"
                    value="Add Feedback" />
            </div>
        </div>
    </div>
            `;

        reviewsContainer.appendChild(reviewElement);
    });
});

assignReview.addEventListener("click", async event => {
    console.log(`assign Review clicked on user ${selectedUserId}`);
    await getUsersForAssigningReview();
    reviewInputDiv.style.display = "none";
    feedbackInputDiv.style.display = "none";
    assignReviewDiv.style.display = "inline-block";
});

// assignReviewButton.addEventListener("click", async event => {});

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
            // userElement.addEventListener("click", () => {
            //     userClicked();
            // });
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

async function getUsersForAssigningReview() {
    const response = await fetch("/api/employees", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    const userList = data.users;
    const employeesContainer =
        document.getElementsByClassName("assign-review-div")[0];
    employeesContainer.innerHTML = "";
    userList.forEach(user => {
        if (selectedUserId != user._id) {
            console.log(selfUserId);
            console.log(selectedUserId);
            var userElement = document.createElement("div");
            userElement.classList.add("user-card");
            userElement.addEventListener("click", event => {
                assignUserReview(selectedUserId, user._id);
            });
            userElement.innerHTML = `
                <h5 data-user-id="${user._id}" class="user-name">
                    ${user.firstname} ${user.lastname} ( ${user.role} )
                </h5>
                <h6 data-user-id="${user._id}" class="user-name">
                    ${user.email}
                </h6>`;
            employeesContainer.appendChild(userElement);
        }
    });
}

async function getReviewsAssignedToMe() {
    const response = await fetch(`/api/assignReviews/${selfUserId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    const userList = data.usersAssignedReview;
    console.log(data);
    const employeesContainer =
        document.getElementsByClassName("user-list-assign")[0];
    employeesContainer.innerHTML = "";

    userList.forEach(user => {
        if (selectedUserId != user._id) {
            console.log(selfUserId);
            console.log(selectedUserId);
            var userElement = document.createElement("div");
            userElement.classList.add("user-card");
            userElement.addEventListener("click", event => {
                selectedUserId = user._id;
                reviewInputDiv.style.display = "inline-block";
                feedbackInputDiv.style.display = "none";
            });
            userElement.innerHTML = `
                <h5 data-user-id="${user._id}" class="user-name">
                    ${user.firstname} ${user.lastname} ( ${user.role} )
                </h5>
                <h6 data-user-id="${user._id}" class="user-name">
                    ${user.email}
                </h6>`;
            employeesContainer.appendChild(userElement);
        }
    });
}

getReviewsAssignedToMe();
getUsersForAssigningReview();
getUsers();
