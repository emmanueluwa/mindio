import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";

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

  transport.sendMail({
    to: user.email,
    from: "auth@mindio.com",
    html: "<h1>123445</h1>",
  });

  res.status(201).json({ user });
};
