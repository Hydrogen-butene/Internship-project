import express from "express"
import { Logout, signin, signup } from "../controller/user-controller.js"
import isAuthenticatedUser from "../middleware/Auth.js"


const userRouter = express.Router()

userRouter.post("/register",signup)
userRouter.post("/login",signin)
userRouter.post("/logout",isAuthenticatedUser, Logout)

export default userRouter;
