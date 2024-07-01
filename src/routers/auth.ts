import { create, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import { CreatingUserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreatingUserSchema), create);

router.post("/verify-email", verifyEmail);

export default router;
