import { Router } from "express";
import { createPodcast } from "../controllers/user.controllers.js";

const userRouter = Router()

userRouter.route("/podcast").post(createPodcast)

export default userRouter