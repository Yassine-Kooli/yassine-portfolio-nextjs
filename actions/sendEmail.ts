"use server";

import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import { contactFormEmailHtml } from "@/email/contact-form-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Change to "Contact Form <noreply@yourdomain.com>" when you add your domain
      to: "kooli.yassine0@gmail.com", // Your email address
      subject: "New message from your portfolio website",
      replyTo: senderEmail as string,
      html: contactFormEmailHtml({
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
    if (error) return { error: error.message };
    return { data };
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }
};
