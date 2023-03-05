import express from "express";
import { signUpUser, loginUser } from "../controllers/controller.js";

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

export default router;
