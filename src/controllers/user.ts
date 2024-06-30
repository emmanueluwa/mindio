import { RequestHandler } from "express";

import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import { sendVerificationMail } from "#/utils/mail";
import { generateOTP } from "#/utils/helper";

export const create: RequestHandler = async (req: CreatingUser, res) => {
  const { email, password, name } = req.body;
  CreatingUserSchema.validate({ email, password, name }).catch((error) => {});

  const user = await User.create({ email, password, name });

  // sending verification email
  const token = generateOTP();
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};
