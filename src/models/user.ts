import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favourites: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: Object, url: String, publicId: String },
    verified: { type: Boolean, default: false },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Audio " }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tokens: [String],
  },
  { timestamps: true }
);

//fire this function before saving
userSchema.pre("save", async function (next) {
  //hash token
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

//compare
userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);

  return result;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
