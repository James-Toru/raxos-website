import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { buildEnquiryEmail, parseEnquiryPayload } from "@/lib/enquiry";

export const runtime = "nodejs";

const requestsByIp = new Map<string, { count: number; resetAt: number }>();
const rateWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requestsByIp.get(ip);

  if (!current || current.resetAt < now) {
    requestsByIp.set(ip, { count: 1, resetAt: now + rateWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Please submit the enquiry form again." },
      { status: 400 },
    );
  }

  const parsed = parseEnquiryPayload(payload);

  if (!parsed.ok) {
    if (parsed.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ message: parsed.message }, { status: parsed.status });
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? "587");
    const transporter = nodemailer.createTransport({
      host: getEnv("SMTP_HOST"),
      port,
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: process.env.SMTP_REQUIRE_TLS !== "false",
      auth: {
        user: getEnv("SMTP_USER"),
        pass: getEnv("SMTP_PASSWORD"),
      },
    });

    await transporter.sendMail(
      buildEnquiryEmail(parsed.data, {
        to: getEnv("CONTACT_TO"),
        from: getEnv("CONTACT_FROM"),
      }),
    );

    return NextResponse.json({ message: "Your enquiry has been sent." });
  } catch (error) {
    console.error("Failed to send Raxos enquiry", error);

    return NextResponse.json(
      { message: "We could not send your enquiry right now. Please try again later." },
      { status: 500 },
    );
  }
}
