"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { validateEnquiryFields } from "@/lib/enquiry";

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
    const validation = validateEnquiryFields(form);

    if (!validation.ok) {
      setStatus("error");
      setStatusMessage(validation.message);
      const invalidField = event.currentTarget.elements.namedItem(validation.field);
      if (invalidField instanceof HTMLElement) {
        invalidField.focus();
      }
      return;
    }

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
      noValidate
      aria-labelledby="enquiry-form-title"
      initial={{ opacity: 0.25, y: 42, rotateX: 2 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <span className="polygon-fill panel-fill" aria-hidden="true" />
      <div className="panel-glow" aria-hidden="true" />
      <div className="contact-copy">
        <p className="form-eyebrow">{"// INITIATE CONTACT"}</p>
        <h2 id="enquiry-form-title">
          INTERESTED<br />
          IN <span>RAXOS?</span>
        </h2>
        <p className="form-intro">
          LEAVE YOUR DETAILS AND OUR TEAM<br />WILL REACH OUT TO YOU.
        </p>
        <article className="global-card">
          <div className="world-grid" aria-hidden="true"><i /></div>
          <p><strong>GLOBAL BY DESIGN.</strong><br />BUILT FOR TEAMS.<br />ENGINEERED FOR IMPACT.</p>
          <small>▥▥▥▥▥ RAXOS CORP // 001</small>
        </article>
      </div>
      <label className="honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </label>

      <div className="form-fields">
        <span className="form-frame" aria-hidden="true" />
        <label>
          <span>{"// NAME"}</span>
          <div className="input-wrap">
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Your Name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>
        </label>

        <label>
          <span>{"// EMAIL"}</span>
          <div className="input-wrap">
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>
        </label>

        <label>
          <span>{"// COMPANY"}</span>
          <div className="input-wrap">
            <input
              name="company"
              autoComplete="organization"
              placeholder="Your Company"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </div>
        </label>

        <label>
          <span>{"// MESSAGE"}</span>
          <div className="input-wrap textarea-wrap">
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell us about your needs..."
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </div>
        </label>

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
        >
          <span className="polygon-fill button-fill" aria-hidden="true" />
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
      </div>
    </motion.form>
  );
}
