import * as yup from "yup";

export const CreatingUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(3, "Please choose a longer name!")
    .max(20, "Name is too long!"),
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must contain at least one letter, one number, and one special character (!@#$%^&*)"
    ),
});
