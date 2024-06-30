import nodemailer from "nodemailer";
import path from "path";

import { CreatingUser } from "#/utils/@types/user";
import { CreatingUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import { generateOTP } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

const generateMailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name, email, userId } = profile;

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  const welcomeMessage = `Hi ${name}, welcome to Mindio! There are a lot of features we offer to verified users. Use the OTP to verify your email.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
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
};
