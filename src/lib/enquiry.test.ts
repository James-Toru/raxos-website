import { describe, expect, it } from "vitest";
import {
  buildEnquiryEmail,
  parseEnquiryPayload,
  sanitizeHeaderValue,
  validateEnquiryFields,
} from "./enquiry";

describe("validateEnquiryFields", () => {
  const validFields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines Ltd",
    message: "We want to coordinate AI workflows across operations.",
  };

  it("rejects a trimmed name shorter than two characters", () => {
    expect(validateEnquiryFields({ ...validFields, name: " A " })).toEqual({
      ok: false,
      field: "name",
      message: "Please enter your name.",
    });
  });

  it("rejects an invalid email address", () => {
    expect(validateEnquiryFields({ ...validFields, email: "not-an-email" })).toEqual({
      ok: false,
      field: "email",
      message: "Please enter a valid email address.",
    });
  });

  it("rejects a trimmed message shorter than twelve characters", () => {
    expect(validateEnquiryFields({ ...validFields, message: " too short " })).toEqual({
      ok: false,
      field: "message",
      message: "Please add a little more detail about your use case.",
    });
  });

  it("accepts valid fields and returns normalized data", () => {
    expect(
      validateEnquiryFields({
        ...validFields,
        name: "  Ada Lovelace  ",
        email: "  ADA@EXAMPLE.COM  ",
        company: "  Analytical Engines Ltd  ",
        message: "  We want to coordinate AI workflows across operations.  ",
      }),
    ).toEqual({ ok: true, data: validFields });
  });
});

describe("parseEnquiryPayload", () => {
  it("accepts a complete enquiry payload", () => {
    const result = parseEnquiryPayload({
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines Ltd",
      message: "We want to coordinate AI workflows across operations.",
      website: "",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Ada Lovelace",
        email: "ada@example.com",
        company: "Analytical Engines Ltd",
        message: "We want to coordinate AI workflows across operations.",
      });
    }
  });

  it("rejects invalid emails and short messages", () => {
    const result = parseEnquiryPayload({
      name: "Ada",
      email: "not-an-email",
      company: "",
      message: "short",
      website: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Please enter a valid email address.");
    }
  });

  it("rejects filled honeypot submissions", () => {
    const result = parseEnquiryPayload({
      name: "Bot",
      email: "bot@example.com",
      company: "",
      message: "This should not be accepted by the endpoint.",
      website: "https://spam.example",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(204);
    }
  });
});

describe("buildEnquiryEmail", () => {
  it("uses the site mailbox as from/to and visitor email as reply-to", () => {
    const email = buildEnquiryEmail(
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        company: "Analytical Engines Ltd",
        message: "We want to coordinate AI workflows across operations.",
      },
      {
        to: "sandbox@raxos.ai",
        from: "Raxos Website <sandbox@raxos.ai>",
      },
    );

    expect(email.to).toBe("sandbox@raxos.ai");
    expect(email.from).toBe("Raxos Website <sandbox@raxos.ai>");
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.subject).toBe("Raxos enquiry from Ada Lovelace");
    expect(email.text).toContain("Company / project: Analytical Engines Ltd");
    expect(email.html).toContain("We want to coordinate AI workflows");
  });
});

describe("sanitizeHeaderValue", () => {
  it("removes newline characters from header values", () => {
    expect(sanitizeHeaderValue("Ada\nBcc: bad@example.com")).toBe(
      "Ada Bcc: bad@example.com",
    );
  });
});
