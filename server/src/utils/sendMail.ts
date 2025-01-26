import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: SendMailOptions) => {
  // const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
  });

  try {
    // const info =
    await transporter.sendMail({
      from: '"Support Team" <support@example.com>',
      to,
      subject,
      text,
      html,
    });
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return false;
  }
};
