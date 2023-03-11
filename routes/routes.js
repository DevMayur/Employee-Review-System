import express from "express";
import {
    signUpUser,
    loginUser,
    getAllEmployees,
    addReview,
    getReviewsForUser,
    assignReview,
    deleteUser,
    getAssignedReviews,
    createUserPage,
    createUser,
    makeAdmin,
    searchUsers,
    addFeedback,
    updateUser,
    getUser,
} from "../controllers/controller.js";
import User from "../models/userModel.js";

const router = express.Router();

router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(loginUser);

router.route("/signup").post(signUpUser);

router.route("/dashboard").get((req, res) => {
    res.render("dashboard");
});

router.route("/adminDashboard").get((req, res) => {
    res.render("admin");
});

router.route("/employees").get(getAllEmployees);

router.route("/search/:query").get(searchUsers);

router.route("/employees/:id").delete(deleteUser);

router
    .route("/reviews/:id")
    .post(addReview)
    .get(getReviewsForUser)
    .put(addFeedback);

//getReviewsForUser
router.route("/reviews").post(getReviewsForUser);

router.route("/assignReviews").post(assignReview);

router.route("/assignReviews/:id").get(getAssignedReviews);

router.route("/createUser").get(createUserPage).post(createUser);

router.route("/makeadmin/:id").put(makeAdmin);

router.route("/updateUser/:userId").put(updateUser);

router.route("/users/:userId").get(getUser);

export default router;
