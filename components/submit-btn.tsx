import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useFormStatus } from "react-dom";
import { useTranslation } from "@/lib/hooks";

export default function SubmitBtn() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <button
      type="submit"
      className="self-center mt-1 flex items-center justify-center gap-2 h-12 px-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      disabled={pending}
    >
      {pending ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <>
          {t('contact.submitButton')}
          <FaPaperPlane className="text-xs opacity-80 group-hover:translate-x-0.5 transition-transform" />
        </>
      )}
    </button>
  );
}
