import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "5h" },
    },
  },
  { collection: "otp" }
);

export default mongoose.model("otp", otpSchema);
