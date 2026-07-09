export type EnquiryData = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type EnquiryParseResult =
  | { ok: true; data: EnquiryData }
  | { ok: false; message: string; status: number };

export type EnquiryMailConfig = {
  from: string;
  to: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function parseEnquiryPayload(payload: unknown): EnquiryParseResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Please complete the enquiry form.", status: 400 };
  }

  const source = payload as Record<string, unknown>;
  const website = readString(source.website);

  if (website) {
    return { ok: false, message: "", status: 204 };
  }

  const name = readString(source.name);
  const email = readString(source.email).toLowerCase();
  const company = readString(source.company);
  const message = readString(source.message);

  if (name.length < 2) {
    return { ok: false, message: "Please enter your name.", status: 400 };
  }

  if (!emailPattern.test(email)) {
    return { ok: false, message: "Please enter a valid email address.", status: 400 };
  }

  if (message.length < 12) {
    return {
      ok: false,
      message: "Please add a little more detail about your use case.",
      status: 400,
    };
  }

  return {
    ok: true,
    data: {
      name: name.slice(0, 120),
      email: email.slice(0, 180),
      company: company.slice(0, 160),
      message: message.slice(0, 2200),
    },
  };
}

export function buildEnquiryEmail(data: EnquiryData, config: EnquiryMailConfig) {
  const safeName = sanitizeHeaderValue(data.name);
  const safeReplyTo = sanitizeHeaderValue(data.email);
  const company = data.company || "Not provided";
  const subject = `Raxos enquiry from ${safeName}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company / project: ${company}`,
    "",
    "Use case:",
    data.message,
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.55; color: #111;">
      <h2 style="margin: 0 0 16px;">New Raxos enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company / project:</strong> ${escapeHtml(company)}</p>
      <p><strong>Use case:</strong></p>
      <p style="white-space: pre-line;">${escapeHtml(data.message)}</p>
    </div>
  `;

  return {
    from: config.from,
    to: config.to,
    replyTo: safeReplyTo,
    subject,
    text,
    html,
  };
}
