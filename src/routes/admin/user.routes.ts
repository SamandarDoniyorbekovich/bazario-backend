import { Router } from "express";
import { authMiddleWare } from "../../moddleware/authMiddleWare";
import { UserController } from "../../controller/user.controller";


const router = Router();

// router.post("/register", UserController.register);
router.post("/login", UserController.login)

router.get("/me", authMiddleWare, UserController.getMe)

router.post("/refresh-token", UserController.refreshToken)

export default router;
