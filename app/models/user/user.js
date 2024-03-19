import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { getToken } from "../../utils/functions.js";
import OTP from "./otp.js";


const bill = {
  total_amount: Number,
  meals: [
    {
      meal_id: { type: mongoose.Schema.Types.ObjectId, ref: "menu" },
      details: String,
      count: Number,
    },
  ],
  date: { type: Date, default: Date.now },
  employ_name: String,
  restaurant_name: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
};
const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    password: { type: String, select: false },
    email: { type: String, unique: true },
    phone_number: { type: String },
    archived_bills: [bill],
    favorite_meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "menu" }],
  },
  { collection: "user", timestamps: true }
);
userSchema.statics.signup = async function ({
  full_name,
  phone_number,
  password,
  email,
  otp,
}) {
  try {
    const User = this;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }
    //Check OTP
    if (!checkOTP(email, otp)) {
      return { success: false, message: "Invalid OTP" };
    }
    password = await bcrypt.hash(password, 10);
    let newUser = new User({
      full_name,
      password,
      phone_number,
      email,
    });
    newUser = await newUser.save();
    newUser = newUser.toObject();
    delete newUser.password;
    const token = getToken({ ...newUser, user_type: "client" });
    return { success: true, message: "Login successful", token, user: newUser };
  } catch (error) {
    return { success: false, message: "Signup failed", error };
  }
};

userSchema.statics.login = async function (email, password) {
  try {
    const User = this;
    let user = await User.findOne({ email }).select("+password");

    if (!user) return { success: false, message: "User is not found" };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return { success: false, message: "Invalid credentials" };

    user = user.toObject();
    delete user.password;
    const token = getToken({ ...user, user_type: "client" });
    return { success: true, message: "Login successful", token, user };
  } catch (error) {
    return { success: false, message: "Login failed", error };
  }
};

async function checkOTP(email, otp) {
  const existingOTP = await OTP.findOne({ email, otp });
  if (existingOTP) {
    await OTP.deleteOne({ email, otp });
    return true; 
  } else {
    return false; 
  }
}
export default mongoose.model("user", userSchema);
