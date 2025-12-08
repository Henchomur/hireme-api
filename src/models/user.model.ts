import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../constants/roles";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.JOB_SEEKER,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IUser>("User", UserSchema);
