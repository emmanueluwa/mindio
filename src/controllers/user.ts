import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";

import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateOTP } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

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

  const welcomeMessage = `Hi ${name}, welcome to Mindio! There are a lot of features we offer to verified users. Use the OTP to verify your email.`;

  transport.sendMail({
    to: user.email,
    from: "auth@mindio.com",
    subject: "Welcome message",
    html: generateTemplate({
      title: "Welcome to Mindio",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });

  res.status(201).json({ user });
};
