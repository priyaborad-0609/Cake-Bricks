import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: `"Cake Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ OTP email sent to:", to);
  } catch (error) {
    // ❌ Gmail / network fail → fallback
    console.log("❌ Email failed, OTP fallback:");
    console.log("📩 OTP:", text);
  }
};

export default sendEmail;
