import { api } from "../API/axios.api";


// Send Register OTP
export const sendRegisterOtpApi = async (data) => {
    try {
        const res = await api.post("/auth/register/send-otp", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || "Failed to send register OTP";
    }
};

// Verify Register OTP
export const verifyRegisterOtpApi = async (data) => {
    try {
        console.log("🚀 SENDING REGISTER OTP DATA:", data);
        const res = await api.post("/auth/register/verify-otp", data);

        return res.data;
    } catch (error) {
        throw error.response?.data || "OTP verification failed";
    }
};


// Send Login OTP
export const sendLoginOtpApi = async (data) => {
    try {
        const res = await api.post("/auth/login/send-otp", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || "Failed to send login OTP";
    }
};

// Verify Login OTP
export const verifyLoginOtpApi = async (data) => {
    try {
        console.log("🚀 SENDING VERIFY OTP DATA:", data);
        const res = await api.post("/auth/login/verify-otp", data);
        return res.data;
    } catch (error) {
        console.log("error", error);
        throw error.response?.data || "Login OTP verification failed";
    }
};



// Send Forgot Password OTP
export const forgotPasswordApi = async (data) => {
    try {
        const res = await api.post("/auth/forgot-password/send-otp", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || "Failed to send OTP";
    }
};

// Reset Password (OTP + New Password)
export const resetPasswordApi = async (data) => {
    try {
        const res = await api.post("/auth/forgot-password/reset-password", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || "Password reset failed";
    }
};
