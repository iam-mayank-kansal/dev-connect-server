// utils/otpTemplate.js
function otpTemplate({ otp, title = "OTP Verification", message = "Use the OTP below to Reset Password." }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
      }
      .container {
        width: 100%;
        padding: 40px 0;
        text-align: center;
      }
      .card {
        width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1e3a8a;
        padding: 20px;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
      .body {
        padding: 30px;
        color: #333333;
        font-size: 16px;
        line-height: 1.6;
        text-align: left;
      }
      .otp-box {
        text-align: center;
        margin: 30px 0;
      }
      .otp {
        display: inline-block;
        background-color: #1e40af;
        color: #ffffff;
        font-size: 28px;
        font-weight: bold;
        padding: 15px 30px;
        border-radius: 8px;
        letter-spacing: 5px;
      }
      .footer {
        background-color: #f1f5f9;
        padding: 15px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <table class="card" cellspacing="0" cellpadding="0">
        <tr>
          <td class="header">Devconnect</td>
        </tr>
        <tr>
          <td class="body">
            <p>Hello,</p>
            <p>${message}</p>
            <div class="otp-box">
              <span class="otp">${otp}</span>
            </div>
            <p>This OTP is valid for the next <b>10 minutes</b>. Do not share it with anyone.</p>
            <p>If you didn’t request this, please ignore this email.</p>
            <br/>
            <p style="color:#555555;">Regards,<br/>The DevConnect Team</p>
          </td>
        </tr>
        <tr>
          <td class="footer">© ${new Date().getFullYear()} DevConnect. All rights reserved.</td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}

module.exports = otpTemplate;
