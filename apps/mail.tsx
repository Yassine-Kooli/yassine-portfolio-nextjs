"use client";

import { useState } from "react";
import { LuFeather, LuSend } from "react-icons/lu";
import { sendEmail } from "@/actions/sendEmail";
import { profile } from "@/lib/data";
import { useSystem } from "@/store/system";

export default function Mail() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    setStatus("sending");
    setError(null);
    const { error } = await sendEmail(formData);
    if (error) {
      setError(error);
      setStatus("idle");
      return;
    }
    setStatus("sent");
    useSystem.getState().notify("Raven dispatched", "Your message is on its way. I'll reply soon.");
  };

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-crypt p-8 text-center">
        <LuFeather size={48} className="text-accent" />
        <h2 className="font-display text-2xl tracking-wide text-parchment">Message sent</h2>
        <p className="max-w-sm text-ash-300">The raven flies through the fog. Expect an answer before the next full moon.</p>
        <button onClick={() => setStatus("idle")} className="mt-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-bone hover:bg-white/5">
          Write another
        </button>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="flex h-full flex-col bg-crypt text-sm text-bone">
      <div className="space-y-px border-b border-black/60">
        <Row label="To">
          <span className="text-ash-300">{profile.name} &lt;{profile.email}&gt;</span>
        </Row>
        <Row label="From">
          <input name="senderEmail" type="email" required maxLength={500} placeholder="you@example.com" className="w-full bg-transparent outline-none placeholder:text-ash-600" />
        </Row>
      </div>
      <textarea
        name="message"
        required
        maxLength={5000}
        placeholder="Speak, traveller. A project, an offer, a favourite Opeth album…"
        className="flex-1 resize-none bg-transparent p-5 leading-relaxed outline-none placeholder:text-ash-600"
      />
      <div className="flex items-center justify-between gap-3 border-t border-black/60 p-3">
        <span className="text-xs text-[#d0584f]">{error}</span>
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center gap-2 rounded-lg bg-accent/85 px-4 py-2 text-parchment transition hover:bg-accent disabled:opacity-50"
        >
          <LuSend size={14} /> {status === "sending" ? "Sending…" : "Send raven"}
        </button>
      </div>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-4 bg-black/20 px-5 py-3">
      <span className="w-12 font-display text-xs tracking-widest text-ash-500">{label.toUpperCase()}</span>
      {children}
    </label>
  );
}
