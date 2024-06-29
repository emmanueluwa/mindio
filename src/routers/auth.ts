import { validate } from "#/middleware/validator";
import User from "#/models/user";
import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  validate(CreatingUserSchema),
  async (req: CreatingUser, res) => {
    const { email, password, name } = req.body;
    CreatingUserSchema.validate({ email, password, name }).catch((error) => {});

    const user = await User.create({ email, password, name });

    res.json({ user });
  }
);

export default router;
