const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify()
  .then(() => console.log("SMTP OK"))
  .catch(console.error);
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const sendOtpEmail = async (to, otp) => {

  const html =`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Evalon Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style type="text/css">
        /* Standard system font stack for maximum compatibility */
        body { margin: 0; padding: 0; min-width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; border-collapse: separate; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color: #10b981; padding: 12px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
                                        <!-- CSS Based Logo Initial -->
                                        <span style="color: #ffffff; font-size: 24px; font-weight: 900; font-family: Helvetica, Arial, sans-serif; display: block; width: 28px; height: 28px; line-height: 28px; text-align: center;">E</span>
                                    </td>
                                    <td style="padding-left: 15px;">
                                        <span style="font-size: 28px; font-weight: 800; letter-spacing: -0.03em; color: #064e3b; font-family: Helvetica, Arial, sans-serif;">EVALON</span>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 12px 0 0 0; font-size: 13px; letter-spacing: 0.15em; color: #10b981; text-transform: uppercase; font-weight: 700; font-family: Helvetica, Arial, sans-serif;">Excellence in Learning</p>
                        </td>
                    </tr>

                    <!-- Decorative Divider Accent -->
                    <tr>
                        <td align="center" style="padding: 0 40px 20px 40px;">
                            <div style="background-color: #ecfdf5; width: 60px; height: 4px; border-radius: 2px;"></div>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 50px 40px 50px;">
                            <h1 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700; text-align: center; color: #111827; font-family: Helvetica, Arial, sans-serif;">Security Verification</h1>
                            <p style="margin: 0 0 35px 0; font-size: 16px; line-height: 1.6; text-align: center; color: #4b5563; font-family: Helvetica, Arial, sans-serif;">
                                To complete your password reset for Evalon, please use the secure verification code provided below.
                            </p>

                            <!-- Enhanced OTP Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 30px; display: inline-block; min-width: 320px;">
                                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #059669; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: Helvetica, Arial, sans-serif;">Your One-Time Password</p>
                                            <span style="font-family: Courier, monospace; font-size: 42px; font-weight: 800; color: #064e3b; display: block; letter-spacing: 12px; text-indent: 12px;">${otp}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning (CSS Accent) -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 4px; margin-bottom: 40px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; font-size: 14px; color: #9a3412; line-height: 1.5; font-family: Helvetica, Arial, sans-serif;">
                                            <strong>Security Alert:</strong> This code will expire in 10 minutes. Do not share this with anyone. Evalon security will never ask for this code over the phone or email.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Requirements -->
                            <div style="border-top: 1px solid #f3f4f6; padding-top: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 13px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; font-family: Helvetica, Arial, sans-serif;">Educational Best Practices</h3>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 12px; font-size: 14px; color: #4b5563; font-family: Helvetica, Arial, sans-serif;">
                                            <span style="color: #10b981; font-weight: bold; margin-right: 8px;">&bull;</span> Use a phrase that's easy for you to remember but hard for others to guess.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 14px; color: #4b5563; font-family: Helvetica, Arial, sans-serif;">
                                            <span style="color: #10b981; font-weight: bold; margin-right: 8px;">&bull;</span> Avoid using your name, birthday, or common school names.
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Quote Section -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #065f46 0%, #059669 100%); border-radius: 16px; padding: 40px; text-align: center; color: #ffffff;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 12px 0; font-size: 20px; font-style: italic; font-weight: 600; line-height: 1.5; font-family: Helvetica, Arial, sans-serif;">"The beautiful thing about learning is that no one can take it away from you."</p>
                                        <p style="margin: 0; font-size: 14px; color: #d1fae5; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-family: Helvetica, Arial, sans-serif;">— B.B. King</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 40px; border-top: 1px solid #f3f4f6;">
                            <p style="margin: 0 0 15px 0; font-size: 13px; color: #9ca3af; line-height: 1.6; font-family: Helvetica, Arial, sans-serif;">
                                This is an automated security message from the Evalon Education Platform. If you didn't request this, please ignore this email or contact support.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 700; font-family: Helvetica, Arial, sans-serif;">
                                &copy; 2025 Evalon Platform.
                            </p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af; font-family: Helvetica, Arial, sans-serif;">
                                Helping you learn, one step at a time.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Evalon Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Evalon Password Reset OTP",
    html
  });
};

module.exports = sendOtpEmail;
