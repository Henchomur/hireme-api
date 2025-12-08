import mongoose, { Schema, Document } from "mongoose";
import { ApplicationStatus } from "../constants/roles";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  resumeUrl: string;
  status: ApplicationStatus;
  payment: {
    amount: number;
    transactionId: string;
    status: "PAID" | "UNPAID";
    date: Date;
  };
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
    payment: {
      amount: { type: Number, required: true, default: 100 },
      transactionId: { type: String, required: true },
      status: { type: String, default: "PAID" },
      date: { type: Date, default: Date.now },
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
