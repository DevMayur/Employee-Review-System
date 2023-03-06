import express from "express";
import {
    signUpUser,
    loginUser,
    getAllEmployees,
    addReview,
} from "../controllers/controller.js";

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

router.route("/reviews/:id").post(addReview);

export default router;
