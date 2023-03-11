if (localStorage.getItem("token")) {
} else {
    window.location.href = "/api/login";
}
const inputReview = document.getElementById("review-input");
const submitReview = document.getElementById("submit-review");
// const assignReviewButton = document.getElementById("assign-button");

const reviewInputDiv = document.getElementById("user-reviews");
const feedbackInputDiv = document.getElementById("feedback-input");
const assignReviewDiv = document.getElementById("assign-review-div");
const addFeedbackButton = document.getElementById("add-feedback-button");

const feedbackSubmitButton = document.getElementsByName("add-feedback-btn")[0];

const searchIcon = document.getElementById("search-icon");

const logoutButton = document.getElementById("btn-logout");

logoutButton.addEventListener("click", async event => {
    // Clear cache
    window.location.reload(true);

    // Clear localStorage
    localStorage.clear();

    // Redirect to login page
    window.location.href = "/api/login";
});

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
        location.reload();

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
    var feedbackField = document.getElementById("feedback");

    feedbackSubmitButton.addEventListener("click", async event => {
        console.log(`feedback added value - ${feedbackField.value}`);
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                feedback: feedbackField.value,
            }),
        });

        const data = await response.json();
        console.log(data);
        location.reload();
    });
}

const userCards = document.querySelectorAll(".user-card");
const contextMenu = document.querySelector(".contextmenu");
var selectedUserId;

const updateButton = document.getElementById("update");
const addReview = document.getElementById("add-review");
const deleteUser = document.getElementById("delete-user");
const viewReviews = document.getElementById("view-reviews");
const assignReview = document.getElementById("assign-review");
const makeAdmin = document.getElementById("make-admin");

viewReviews.addEventListener("click", async event => {
    const response = await fetch(`/api/reviews/${selectedUserId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    console.log(data);

    var htmlData = "";
    const reviewsContainer =
        document.getElementsByClassName("reviews-list-div")[0];
    reviewsContainer.innerHTML = "";
    data.forEach(review => {
        var reviewElement = document.createElement("div");
        // reviewElement.classList.add("review-card");
        if (review.receiver._id == selfUserId) {
            reviewElement.addEventListener("click", () => {
                onFeedbackButtonClicked(
                    review._id,
                    review.sender.firstname + review.sender.lastname
                );
            });
        }

        var feedbackString = "";
        if (review.feedback) {
            feedbackString = review.feedback;
        }

        reviewElement.innerHTML = `<div class="review-card">
        <div class="user-header">
            <h5 class="user-header-h5 user-name text-on-light">
                ${review.sender.firstname} ${review.sender.lastname}
            </h5>
            <p class="user-header-h5 user-name text-on-light">
                ${review.review}
            </p>

            <p class="user-header-h5 user-name text-on-light" style='color: blue'>
                ${feedbackString}
            </p>
        </div>
    </div>
            `;

        reviewsContainer.appendChild(reviewElement);
    });
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
        location.reload();

        console.log(data);
    } catch (error) {
        console.log(error);
    }
});

window.addEventListener("click", function (event) {
    let contextmenu = document.querySelector(".contextmenu");
    contextmenu.classList.remove("active");
});

async function searchUsers(searchQuery) {
    const employeesContainer = document.getElementsByClassName("user-list")[0];
    try {
        const response = await fetch(`/api/search/${searchQuery}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        employeesContainer.innerHTML = "";
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

            userElement.addEventListener("contextmenu", event => {
                event.preventDefault();
                console.log(`context menu click`);
                selectedUserId = event.target.dataset.userId;
                const scrollY = window.scrollY || window.pageYOffset;
                const scrollX = window.scrollX || window.pageXOffset;
                contextMenu.style.top = `${event.pageY - scrollY}px`;
                contextMenu.style.left = `${event.pageX - scrollX}px`;
                console.log(`scrollX - ${scrollX} || scrollY - ${scrollY}`);
                contextMenu.classList.add("active");
            });
            employeesContainer.appendChild(userElement);
        });
    } catch (error) {
        console.log(error);
    }
}

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
                console.log(`context menu click`);
                selectedUserId = event.target.dataset.userId;
                const scrollY = window.scrollY || window.pageYOffset;
                const scrollX = window.scrollX || window.pageXOffset;
                contextMenu.style.top = `${event.pageY - scrollY}px`;
                contextMenu.style.left = `${event.pageX - scrollX}px`;
                console.log(`scrollX - ${scrollX} || scrollY - ${scrollY}`);
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

const searchField = document.getElementsByName("search")[0];
searchIcon.addEventListener("click", () => {
    const searchQuery = searchField.value;
    searchUsers(searchQuery);
});

getReviewsAssignedToMe();
getUsersForAssigningReview();
getUsers();
