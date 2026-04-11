import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtpEmail.js"

// Helper to generate OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


// ================= REGISTER =================

//  Send Register OTP

export const sendRegisterOtp = async (req, res) => {
  try {
    const { name, email, phone, gender, password } = req.body;

    let user = await User.findOne({ email });

    // Case 3: User already registered & verified
    if (user && user.isVerified) {
      return res.status(400).json({
        message: "User already registered. Please login."
      });
    }

    const otp = generateOtp();

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        phone,
        gender,
        password: hashedPassword,
        isVerified: false
      });
    }

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("REGISTER OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


//  Verify Register OTP
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,

    );

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= LOGIN =================

//  Send Login OTP
export const sendLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not found or not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.error("LOGIN OTP SEND ERROR:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};


//  Verify Login OTP
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // 🔴 Wrong OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // 🔴 Expired OTP
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN OTP VERIFY ERROR:", error);
    import("fs").then(fs => fs.appendFileSync("error.log", `\nVERIFY ERROR: ${error.stack}\n`));
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};


// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({
        message: "User not found or not verified"
      })
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // 🔴 Wrong OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // 🔴 Expired OTP
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
