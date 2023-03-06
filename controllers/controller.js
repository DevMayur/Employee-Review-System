import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Review from "../models/reviewModel.js";
// Sign up a user
//Rout - POST /api/signup

const signUpUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword, role } =
        req.body;

    if (password != confirmPassword) {
        return res.json({
            message: `Passwords do not match`,
            success: false,
        });
    }

    //see if user already exist
    const userEmailExist = await User.findOne({ email: email });

    if (userEmailExist) {
        return res.json({
            message: `User already exist with provided email ${email}`,
            success: false,
        });
    }

    const user = await User.create({
        firstname,
        lastname,
        email,
        password,
        role,
    });

    if (user) {
        res.json({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
            success: true,
        });
    } else {
        return res.json({
            message: `Cannot create user`,
            success: false,
        });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        var passwordMatched = await user.matchPassword(password);
        if (!passwordMatched) {
            return res.json({
                message: "Entered password was wrong",
                success: passwordMatched,
            });
        } else {
            res.json({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
                success: passwordMatched,
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getAllEmployees = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            users: users,
            message: "Users list fetched successfully",
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const addReview = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const { reviewText, senderId } = req.body;
    try {
        const reviewTo = await User.findById(employeeId);
        const reviewBy = await User.findById(senderId);

        // const review = new Review({
        //     sender: reviewBy._id,
        //     receiver: reviewTo._id,
        //     review: reviewText,
        // });

        res.json({
            params: reviewTo,
            body: senderId,
        });

        // review.save();

        // if (review) {
        //     res.json({
        //         message: "Review added successfully",
        //     });
        // } else {
        //     res.json({
        //         message: "There was a problem adding review",
        //     });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export { signUpUser, loginUser, getAllEmployees, addReview };
