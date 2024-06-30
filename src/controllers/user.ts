import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateOTP } from "#/utils/helper";

export const create: RequestHandler = async (req: CreatingUser, res) => {
  const { email, password, name } = req.body;
  CreatingUserSchema.validate({ email, password, name }).catch((error) => {});

  const user = await User.create({ email, password, name });

  // sending verification email
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  // one time password => OTP 6 digits
  const token = generateOTP();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  transport.sendMail({
    to: user.email,
    from: "auth@mindio.com",
    html: `<h1>Your verification token is ${token}</h1>`,
  });

  res.status(201).json({ user });
};
