import jwt from "jsonwebtoken";

export function getToken(user) {
  return jwt.sign(user, process.env.JWT, {
    expiresIn: process.env.USER_JWT_EXPIRE_DURATION,
  });
}
export function generateOTP() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function stringToSlug(str, otherString) {
  return `${str.toLowerCase().replace(/\s+/g, "-")}_${otherString}`;
}

