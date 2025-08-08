export const EmailVerification = ({
  username,
  otp,
}: {
  username: string;
  otp: string;
}) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
        font-family: Helvetica, Arial, sans-serif;
        color: #000;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 40px 20px;
        border: 1px solid #eee;
        box-shadow: 0 5px 10px rgba(20, 50, 70, 0.2);
        border-radius: 5px;
        text-align: center;
      }
      .heading {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .otp-box {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 12px;
        margin: 20px auto;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        width: 280px;
      }
      .info-text {
        font-size: 14px;
        color: #444;
        line-height: 1.5;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="heading">Welcome <strong>${username}</strong>, your OTP for VibeChat-Pro is:</div>
      <div class="otp-box">${otp}</div>
      <div class="info-text">
        Please verify you're really you by entering this 6-digit code when you sign in.<br />
        This code will expire in 10 minutes for security reasons.
      </div>
    </div>
  </body>
</html>
`;
};
