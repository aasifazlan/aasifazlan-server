import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://aasifazlan-portfolio.vercel.app',
}));


app.use(express.json());

// POST route to receive contact form data
app.post('/api/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  // Create transporter object using SMTP transport (example with Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // your email address
      pass: process.env.EMAIL_PASS,     // your email password or app password
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,       // your email where you want to receive messages
    subject: `New contact form message from ${name}`,
    text: `
      You have a new message from your website contact form:

      Name: ${name}
      Email: ${email}

      Message:
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send the message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
