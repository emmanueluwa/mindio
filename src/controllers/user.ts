import { RequestHandler } from "express";

import { CreatingUser, VerifyEmailRequest } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import { sendVerificationMail } from "#/utils/mail";
import { generateOTP } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";

export const create: RequestHandler = async (req: CreatingUser, res) => {
  const { email, password, name } = req.body;
  CreatingUserSchema.validate({ email, password, name }).catch((error) => {});

  const user = await User.create({ email, password, name });

  // sending verification email
  const token = generateOTP();
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified" });
};
