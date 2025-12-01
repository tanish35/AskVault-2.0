import nodemailer from "nodemailer";

const sendMail1 = (
  htmlContent: any,
  receiverEmail: string,
  subject: any = "Mail From VideoPlus"
) => {
  const port = process.env.SMTP_PORT;
  const host = process.env.SMTP_HOST;
  const senderEmail = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;

  let transporter = nodemailer.createTransport({
    // @ts-ignore
    host: "smtp.gmail.com",
    port: port,
    secure: true,
    auth: {
      user: host,
      pass: password,
    },
  });

  let mailOptions = {
    from: `"VideoPlus Admin" <${senderEmail}>`,
    to: receiverEmail,
    subject: subject,
    text: htmlContent,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending email:", error);
    }
    // console.log('Email sent successfully:', info.response);
  });
};

const sendMail2 = (
  htmlContent: any,
  receiverEmail: string,
  subject: any = "Mail From VideoPlus",
  senderName: string = "VideoPlus Admin"
) => {
  const port = process.env.SMTP_PORT;
  const host = process.env.SMTP_HOST;
  const senderEmail = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;

  let transporter = nodemailer.createTransport({
    // @ts-ignore
    host: "smtp.gmail.com",
    port: port,
    secure: true,
    auth: {
      user: host,
      pass: password,
    },
  });

  let mailOptions = {
    from: `"${senderName}" <${receiverEmail}>`,
    replyTo: receiverEmail,
    to: senderEmail,
    subject,
    text: htmlContent,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending email:", error);
    }
    console.log(
      "From:",
      mailOptions.from,
      "Email sent successfully:",
      info.response
    );
  });
};

export { sendMail1, sendMail2 };
