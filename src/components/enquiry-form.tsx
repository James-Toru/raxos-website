"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  MessageSquare,
  UserRound,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    setStatusMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setStatusMessage("Sending enquiry...");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.status === 204) {
        setForm(initialState);
        setStatus("sent");
        setStatusMessage("Your enquiry has been sent.");
        return;
      }

      const body = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setStatus("error");
        setStatusMessage(body?.message ?? "We could not send your enquiry right now.");
        return;
      }

      setForm(initialState);
      setStatus("sent");
      setStatusMessage(body?.message ?? "Your enquiry has been sent.");
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please try again.");
    }
  }

  return (
    <motion.form
      className="enquiry-panel"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 28, rotateX: -6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.2, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="panel-glow" aria-hidden="true" />
      <p className="form-eyebrow">{"// INITIATE CONTACT"}</p>
      <h2>
        INTERESTED IN
        <br />
        <span>RAXOS?</span>
      </h2>
      <p className="form-intro">
        Leave your details and our team will reach out to you.
      </p>
      <div className="title-mark" aria-hidden="true" />
      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </label>

      <label>
        <span>NAME</span>
        <div className="input-wrap">
          <input
            required
            autoComplete="name"
            placeholder="Your Name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
          <UserRound aria-hidden="true" size={19} />
        </div>
      </label>

      <label>
        <span>EMAIL</span>
        <div className="input-wrap">
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <Mail aria-hidden="true" size={19} />
        </div>
      </label>

      <label>
        <span>COMPANY</span>
        <div className="input-wrap">
          <input
            autoComplete="organization"
            placeholder="Your Company"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
          <Building2 aria-hidden="true" size={19} />
        </div>
      </label>

      <label>
        <span>MESSAGE</span>
        <div className="input-wrap textarea-wrap">
          <textarea
            required
            rows={4}
            placeholder="Tell us about your needs..."
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
          />
          <MessageSquare aria-hidden="true" size={19} />
        </div>
      </label>

      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        <span>{status === "sending" ? "SENDING MESSAGE" : "SEND MESSAGE"}</span>
        <ArrowRight aria-hidden="true" size={18} />
      </motion.button>

      <p className="security-note">
        <LockKeyhole aria-hidden="true" size={14} /> ALL COMMUNICATIONS ARE ENCRYPTED
      </p>

      {status !== "idle" ? (
        <p className={`form-note form-note-${status}`} role="status">
          {statusMessage}
        </p>
      ) : null}
    </motion.form>
  );
}
