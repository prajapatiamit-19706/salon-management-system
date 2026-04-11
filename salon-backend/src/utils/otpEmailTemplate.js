export const otpEmailTemplate = (otp) => {

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #DCEFF5; font-family: 'Segoe UI', Arial, sans-serif;">

  <!-- Page wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #DCEFF5; padding: 40px 16px;">
    <tr>
      <td align="center">

        <!-- Email card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">

          <!-- ── HEADER ── -->
          <tr>
            <td align="center" style="
              background-color: #0B3558;
              border-radius: 16px 16px 0 0;
              padding: 36px 40px 30px;
            ">
              <!-- Icon -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                <tr>
                  <td align="center" style="
                    width: 56px;
                    height: 56px;
                    background-color: rgba(255,255,255,0.1);
                    border-radius: 14px;
                    font-size: 28px;
                    line-height: 56px;
                    text-align: center;
                  ">✂️</td>
                </tr>
              </table>

              <h1 style="margin: 0 0 6px; color: #FFFFFF; font-size: 22px; font-weight: 700; line-height: 1;">
                Glow & Grace
              </h1>
              <p style="margin: 0; color: rgba(220,239,245,0.5); font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                Client Portal
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="
              background-color: #FFFFFF;
              padding: 40px 40px 36px;
              border-left: 1px solid #BFD6DF;
              border-right: 1px solid #BFD6DF;
            ">
              <h2 style="margin: 0 0 10px; color: #0B3558; font-size: 20px; font-weight: 700;">
                Verify Your Identity
              </h2>
              <p style="margin: 0 0 28px; color: #6B8A99; font-size: 14px; line-height: 1.7;">
                Use the one-time password below to complete your verification.
                This code is valid for <strong style="color: #0B3558;">5 minutes</strong> only.
              </p>

              <!-- OTP container -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="
                    background-color: #DCEFF5;
                    border: 2px dashed #BFD6DF;
                    border-radius: 14px;
                    padding: 28px 20px;
                  ">
                    <!-- Label -->
                    <p style="margin: 0 0 18px; color: #6B8A99; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">
                      Your OTP Code
                    </p>

                    <!-- ── Single OTP box ── -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="
                          padding: 16px 40px;
                          background-color: #FFFFFF;
                          border: 2px solid #BFD6DF;
                          border-radius: 12px;
                          font-size: 36px;
                          font-weight: 800;
                          letter-spacing: 14px;
                          color: #0B3558;
                          text-align: center;
                          box-shadow: 0 2px 12px rgba(11,53,88,0.08);
                          font-family: 'Courier New', Courier, monospace;
                        ">${otp}</td>
                      </tr>
                    </table>

                    <!-- Expiry -->
                    <p style="margin: 16px 0 0; color: #6B8A99; font-size: 12px;">
                      ⏱&nbsp; Expires in 5 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                <tr>
                  <td style="
                    background-color: #CFE6EE;
                    border-radius: 10px;
                    padding: 14px 18px;
                  ">
                    <p style="margin: 0; color: #355E72; font-size: 13px; line-height: 1.6;">
                      🔒&nbsp;
                      <strong style="color: #0B3558;">Never share this OTP</strong>
                      with anyone, including Glow & Grace support. We will never ask for your OTP.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="margin: 0; color: #6B8A99; font-size: 13px; line-height: 1.6;">
                Didn't request this? You can safely ignore this email. If you're concerned, please
                <a href="mailto:support@salonapp.com" style="color: #0B3558; font-weight: 600; text-decoration: none;">
                  contact support
                </a>.
              </p>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td align="center" style="
              background-color: #0B3558;
              border-radius: 0 0 16px 16px;
              padding: 22px 40px;
            ">
              <p style="margin: 0 0 4px; color: rgba(220,239,245,0.4); font-size: 12px;">
                © ${new Date().getFullYear()} Glow & Grace &middot; All rights reserved
              </p>
              <p style="margin: 0; color: rgba(220,239,245,0.25); font-size: 11px;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};