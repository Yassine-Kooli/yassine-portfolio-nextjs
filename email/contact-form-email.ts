const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
};

/** Plain HTML body for the contact-form notification. All user input is escaped. */
export function contactFormEmailHtml({ message, senderEmail }: ContactFormEmailProps) {
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeSender = escapeHtml(senderEmail);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">You received a message from your portfolio contact form</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">${safeMessage}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="margin:0;font-size:14px;color:#4b5563;">The sender's email is: ${safeSender}</p>
    </div>
  </body>
</html>`;
}
