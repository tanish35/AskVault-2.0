import { NextResponse } from "next/server";
import { twiml } from "twilio";

export async function POST() {
  const response = new twiml.VoiceResponse();

  response.say(
    { voice: "Polly.Matthew" },
    "Hello! I'm Tanish's assistant. How can I help you today?"
  );
  response.record({
    action: "/api/voice/process",
    method: "POST",
    maxLength: 30,
    timeout: 3,
    playBeep: false,
    transcribe: false,
  });
  response.say("I didn't hear anything. Goodbye!");
  response.hangup();

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
