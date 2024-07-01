import { create, verifyEmail } from "#/controllers/user";
import { validate } from "#/middleware/validator";
import {
  CreatingUserSchema,
  EmailVerificationBody,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreatingUserSchema), create);

router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);

export default router;
