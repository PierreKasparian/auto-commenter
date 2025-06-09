"use server";
import nodemailer from "nodemailer";

export async function sendMail(toMail: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "auto.commenter.pro@gmail.com",
      pass: process.env.GMAIL_APP_CODE!,
    },
  });
  const options = {
    from: "CommentPro <auto.commenter.pro@gmail.com>", // sender address
    to: toMail, // receiver email
    subject: subject, // Subject line
    text: text,
    // html: HTML_TEMPLATE(message),
  };
  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent successfully");
    console.log("MESSAGE ID: ", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
