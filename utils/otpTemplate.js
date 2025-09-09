// utils/otpTemplate.js

/**
 * Professional OTP Email Template Generator
 * @param {Object} params - Template parameters
 * @param {string} params.otp - The OTP code to display
 * @param {string} [params.title] - Email title/subject
 * @param {string} [params.message] - Custom message text
 * @param {string} [params.companyName] - Company name for branding
 * @param {string} [params.companyLogo] - URL to company logo
 * @param {string} [params.supportEmail] - Support email address
 * @param {number} [params.expiryMinutes] - OTP expiry time in minutes
 * @param {string} [params.primaryColor] - Primary brand color
 * @param {string} [params.userName] - User's name for personalization
 * @returns {string} HTML email template
 */
function otpTemplate({
  otp,
  title = "OTP Verification",
  message = "Use the OTP below to complete your verification.",
  companyName = "DevConnect",
  companyLogo = null,
  supportEmail = "support@devconnect.com",
  expiryMinutes = 5,
  primaryColor = "#2563eb",
  userName = null,
}) {
  // Validate required parameters
  if (!otp) {
    throw new Error("OTP parameter is required");
  }

  // Generate current year for footer
  const currentYear = new Date().getFullYear();

  // Personal greeting
  const greeting = userName ? `Hello ${userName},` : "Hello,";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      line-height: 1.6 !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    
    table {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    
    img {
      border: 0 !important;
      height: auto !important;
      line-height: 100% !important;
      outline: none !important;
      text-decoration: none !important;
    }
    
    /* Container styles */
    .email-container {
      max-width: 600px !important;
      margin: 0 auto !important;
      background-color: #ffffff !important;
    }
    
    .email-wrapper {
      width: 100% !important;
      background-color: #f8fafc !important;
      padding: 40px 20px !important;
    }
    
    /* Header styles */
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, #1e40af 100%) !important;
      padding: 32px 40px !important;
      text-align: center !important;
      border-radius: 12px 12px 0 0 !important;
    }
    
    .logo {
      margin-bottom: 16px !important;
    }
    
    .logo img {
      max-height: 48px !important;
      width: auto !important;
    }
    
    .company-name {
      color: #ffffff !important;
      font-size: 28px !important;
      font-weight: 700 !important;
      margin: 0 !important;
      text-decoration: none !important;
    }
    
    /* Content styles */
    .content {
      padding: 48px 40px !important;
      background-color: #ffffff !important;
    }
    
    .greeting {
      color: #1f2937 !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      margin: 0 0 24px 0 !important;
    }
    
    .message {
      color: #4b5563 !important;
      font-size: 16px !important;
      line-height: 1.7 !important;
      margin: 0 0 32px 0 !important;
    }
    
    /* OTP Container */
    .otp-container {
      background-color: #f9fafb !important;
      border: 2px dashed #e5e7eb !important;
      border-radius: 12px !important;
      padding: 32px !important;
      text-align: center !important;
      margin: 32px 0 !important;
    }
    
    .otp-label {
      color: #6b7280 !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin: 0 0 16px 0 !important;
    }
    
    .otp-code {
      background: linear-gradient(135deg, ${primaryColor} 0%, #1e40af 100%) !important;
      color: #ffffff !important;
      font-size: 36px !important;
      font-weight: 800 !important;
      font-family: 'Courier New', Courier, monospace !important;
      padding: 20px 32px !important;
      border-radius: 8px !important;
      letter-spacing: 8px !important;
      display: inline-block !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
      margin: 0 !important;
    }
    
    /* Security notice */
    .security-notice {
      background-color: #fef3c7 !important;
      border-left: 4px solid #f59e0b !important;
      padding: 20px 24px !important;
      border-radius: 0 8px 8px 0 !important;
      margin: 32px 0 !important;
    }
    
    .security-text {
      color: #92400e !important;
      font-size: 14px !important;
      margin: 0 !important;
      font-weight: 500 !important;
    }
    
    /* Action items */
    .action-text {
      color: #4b5563 !important;
      font-size: 15px !important;
      line-height: 1.6 !important;
      margin: 24px 0 !important;
    }
    
    .expiry-text {
      color: #dc2626 !important;
      font-weight: 600 !important;
    }
    
    /* Footer */
    .footer {
      background-color: #f9fafb !important;
      padding: 32px 40px !important;
      text-align: center !important;
      border-radius: 0 0 12px 12px !important;
      border-top: 1px solid #e5e7eb !important;
    }
    
    .signature {
      color: #4b5563 !important;
      font-size: 16px !important;
      margin: 0 0 24px 0 !important;
    }
    
    .team-name {
      font-weight: 600 !important;
      color: #1f2937 !important;
    }
    
    .divider {
      height: 1px !important;
      background-color: #e5e7eb !important;
      margin: 24px 0 !important;
    }
    
    .footer-links {
      margin: 16px 0 !important;
    }
    
    .footer-link {
      color: ${primaryColor} !important;
      text-decoration: none !important;
      font-size: 14px !important;
      margin: 0 16px !important;
    }
    
    .copyright {
      color: #6b7280 !important;
      font-size: 12px !important;
      margin: 16px 0 0 0 !important;
    }
    
    /* Mobile responsiveness */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px !important;
      }
      
      .header,
      .content,
      .footer {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }
      
      .company-name {
        font-size: 24px !important;
      }
      
      .otp-code {
        font-size: 28px !important;
        letter-spacing: 4px !important;
        padding: 16px 24px !important;
      }
      
      .otp-container {
        padding: 24px 16px !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .content {
        background-color: #ffffff !important;
      }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
      .otp-code {
        border: 2px solid #000000 !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" class="email-container" width="100%" cellspacing="0" cellpadding="0" border="0">
      
      <!-- Header -->
      <tr>
        <td class="header">
          ${
            companyLogo
              ? `
          <div class="logo">
            <img src="${companyLogo}" alt="${companyName} Logo" />
          </div>
          `
              : ""
          }
          <h1 class="company-name">${companyName}</h1>
        </td>
      </tr>
      
      <!-- Content -->
      <tr>
        <td class="content">
          <p class="greeting">${greeting}</p>
          
          <p class="message">${message}</p>
          
          <div class="otp-container">
            <p class="otp-label">Your Verification Code</p>
            <div class="otp-code" role="img" aria-label="OTP Code: ${otp.split("").join(" ")}">${otp}</div>
          </div>
          
          <div class="security-notice">
            <p class="security-text">
              <strong>Security Notice:</strong> This code is valid for <span class="expiry-text">${expiryMinutes} minutes only</span>. 
              Never share this code with anyone. Our team will never ask for your OTP.
            </p>
          </div>
          
          <p class="action-text">
            If you didn't request this verification code, please ignore this email or 
            <a href="mailto:${supportEmail}" style="color: ${primaryColor};">contact our support team</a> 
            if you have concerns about your account security.
          </p>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td class="footer">
          <p class="signature">
            Best regards,<br>
            <span class="team-name">The ${companyName} Team</span>
          </p>
          
          <div class="divider"></div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">Help Center</a>
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
          </div>
          
          <p class="copyright">
            © ${currentYear} ${companyName}. All rights reserved.<br>
            This is an automated message, please do not reply to this email.
          </p>
        </td>
      </tr>
      
    </table>
  </div>
</body>
</html>
  `.trim();
}

module.exports = otpTemplate;
