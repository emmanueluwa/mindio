import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

// expire after 1hr

const emailVerificationTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, expires: 3600, default: Date.now() },
});

//fire this function before saving
emailVerificationTokenSchema.pre("save", async function (next) {
  //hash token
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

//compare
emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);

  return result;
};

export default model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument, {}, Methods>;
