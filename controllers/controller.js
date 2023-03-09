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
    const { review, selfUserId } = req.body;

    try {
        const reviewTo = await User.findById(employeeId);
        const reviewBy = await User.findById(selfUserId);

        const reviewObject = await Review.create({
            sender: reviewBy._id,
            receiver: reviewTo._id,
            review: review,
        });

        if (reviewObject) {
            // Remove the selfUserId from the assignedReviews array of reviewTo
            await User.findByIdAndUpdate(reviewBy._id, {
                $pull: { assignedReviews: reviewTo._id },
            });
            res.json({
                message: "Review added successfully",
                reviewObject: reviewObject,
            });
        } else {
            res.json({
                message: "Review adding failed",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const getReviewsForUser = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;

    try {
        const reviews = await Review.find({
            receiver: employeeId,
        })
            .populate("sender", ["firstname", "lastname"])
            .populate("receiver", ["firstname", "lastname"]);
        res.json(reviews);
    } catch (error) {
        console.log(error);
    }
});

const assignReview = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    console.log(req.body);
    const reviewTo = await User.findById(req.body.reviewTo);
    const reviewBy = await User.findById(req.body.reviewBy);

    try {
        // Update the assignedReviews field of the employee
        console.log(reviewTo);
        reviewBy.assignedReviews.push(reviewTo);
        await reviewBy.save();

        res.json({
            reviewBy: reviewBy,
            message: "review assigned successfully",
        });
    } catch (error) {
        console.log(error);
    }
});

const getAssignedReviews = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId).populate("assignedReviews");
    res.json({
        usersAssignedReview: user.assignedReviews,
        message: "success",
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Delete all reviews where user is either the sender or receiver
    await Review.deleteMany({
        $or: [{ sender: userId }, { receiver: userId }],
    });

    // Remove user from assignedReviews array of all users who have user ID in their assignedReviews
    await User.updateMany(
        { assignedReviews: userId },
        { $pull: { assignedReviews: userId } }
    );

    // Remove the user from the database
    await User.findByIdAndRemove(userId);

    res.json({ message: "User removed" });
});

export {
    signUpUser,
    loginUser,
    getAllEmployees,
    addReview,
    getReviewsForUser,
    assignReview,
    deleteUser,
    getAssignedReviews,
};
