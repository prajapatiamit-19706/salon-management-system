export const feedbackEmailTemplate = ({
  userName,
  serviceName,
  staffName,
  date,
  time,
  feedbackLink,
}) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Share Your Feedback</title>
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
                  ">⭐</td>
                </tr>
              </table>

              <h1 style="margin: 0 0 6px; color: #FFFFFF; font-size: 22px; font-weight: 700; line-height: 1;">
                Glow & Grace
              </h1>
              <p style="margin: 0; color: rgba(220,239,245,0.5); font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                Share Your Experience
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
                How was your visit?
              </h2>
              <p style="margin: 0 0 28px; color: #6B8A99; font-size: 14px; line-height: 1.7;">
                Hi <strong style="color: #0B3558;">${userName}</strong>, your appointment has been completed. We'd love to hear about your experience!
              </p>

              <!-- Appointment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="
                    background-color: #DCEFF5;
                    border: 2px dashed #BFD6DF;
                    border-radius: 14px;
                    padding: 28px 20px;
                  ">
                    
                    <p style="margin: 0 0 8px; color: #6B8A99; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Service
                    </p>
                    <p style="margin: 0 0 16px; color: #0B3558; font-size: 16px; font-weight: bold;">
                      ✂️ ${serviceName}
                    </p>

                    <p style="margin: 0 0 8px; color: #6B8A99; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Date & Time
                    </p>
                    <p style="margin: 0 0 16px; color: #0B3558; font-size: 16px; font-weight: bold;">
                      📅 ${formatDate(date)} at ${time}
                    </p>

                    <p style="margin: 0 0 8px; color: #6B8A99; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Professional
                    </p>
                    <p style="margin: 0; color: #0B3558; font-size: 16px; font-weight: bold;">
                      👩‍💼 ${staffName}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                <tr>
                  <td align="center">
                    <a href="${feedbackLink}" style="
                      display: inline-block;
                      background-color: #0B3558;
                      color: #FFFFFF;
                      font-size: 15px;
                      font-weight: 700;
                      text-decoration: none;
                      padding: 14px 40px;
                      border-radius: 10px;
                      letter-spacing: 0.5px;
                    ">
                      ⭐ Leave Your Feedback
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                <tr>
                  <td style="
                    background-color: #CFE6EE;
                    border-radius: 10px;
                    padding: 14px 18px;
                  ">
                    <p style="margin: 0; color: #355E72; font-size: 13px; line-height: 1.6;">
                      💡&nbsp;
                      Your feedback helps us improve our services and recognize our team members. It only takes a minute!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="margin: 0; color: #6B8A99; font-size: 13px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link in your browser:<br/>
                <a href="${feedbackLink}" style="color: #0B3558; font-weight: 600; text-decoration: none; word-break: break-all;">
                  ${feedbackLink}
                </a>
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
