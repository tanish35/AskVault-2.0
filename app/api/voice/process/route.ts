import { NextResponse } from "next/server";
import { generateText } from "ai";
import { azure } from "@ai-sdk/azure";
import { twiml } from "twilio";

import { getSession, saveSession } from "@/lib/voice/redisSessionMemory";
import { SYSTEM_PROMPT } from "@/lib/config/prompts";
import { searchDocuments, submitContactForm } from "@/lib/tools";

export async function POST(req: Request) {
  const formData = await req.formData();

  const callSid = formData.get("CallSid") as string;
  const recordingUrl = formData.get("RecordingUrl") as string | null;

  console.log("CallSid:", callSid);
  console.log("RecordingUrl:", recordingUrl);

  if (!recordingUrl) {
    return continueListening("I didn't catch that. Please try again.");
  }

  try {
    const audioUrl = `${recordingUrl}.wav`;
    const authHeader =
      "Basic " +
      Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");

    const audioRes = await fetch(audioUrl, {
      headers: { Authorization: authHeader },
    });

    if (!audioRes.ok) {
      console.error("Failed to fetch recording:", audioRes.status);
      return continueListening(
        "I couldn't hear you clearly. Please try again."
      );
    }

    const audioBuffer = await audioRes.arrayBuffer();
    console.log("Audio size:", audioBuffer.byteLength, "bytes");

    if (audioBuffer.byteLength < 1000) {
      return continueListening("I didn't hear anything. Please speak louder.");
    }
    const fd = new FormData();
    fd.append(
      "file",
      new Blob([audioBuffer], { type: "audio/wav" }),
      "recording.wav"
    );

    console.log("Sending to Whisper...");
    const whisperRes = await fetch(`${process.env.WHISPER_URL}/transcribe`, {
      method: "POST",
      body: fd,
    });

    if (!whisperRes.ok) {
      console.error("Whisper error:", await whisperRes.text());
      return continueListening("Speech recognition failed. Please try again.");
    }

    const { text: speechRaw } = await whisperRes.json();
    const speechText = speechRaw?.trim();

    console.log("Transcribed:", speechText);

    if (!speechText) {
      return continueListening("I didn't catch that. Please say it again.");
    }

    const history = await getSession(callSid);
    history.push({ role: "user", content: speechText });

    const SYSTEM_PROMPT_MODIFIED = `
    ${SYSTEM_PROMPT}
    When users provide contact details via speech-to-text, automatically infer and normalize obvious formatting issues instead of asking follow-up questions.

      Rules:
      - If an email is spoken as “name at gmail dot com” or contains spaces, convert it to a valid email format.
      - If a phone number contains spaces, hyphens, or pauses, infer the intended continuous digit sequence.
      - Assume the transcription is correct in intent unless there is genuine ambiguity.
      - Do NOT ask the user to repeat or reformat contact details if they can be reasonably inferred.
      - Proceed with the inferred, corrected values silently.

    `;
    const result = await generateText({
      model: azure("gpt-4o-mini"),
      system: SYSTEM_PROMPT_MODIFIED,
      messages: history,
      tools: { searchDocuments, submitContactForm },
    });
    let finalReply = result.text || "";

    if (!finalReply && result.toolResults && result.toolResults.length > 0) {
      finalReply = result.toolResults
        .map((r: any) => String(r.result))
        .join(" ");
    }
    if (!finalReply) {
      finalReply =
        "I processed your request. Is there anything else I can help you with?";
    }

    console.log("AI Reply:", finalReply);

    history.push({ role: "assistant", content: finalReply });
    await saveSession(callSid, history);

    return continueListening(finalReply);
  } catch (err) {
    console.error("Voice error:", err);
    return continueListening("Something went wrong. Please try again.");
  }
}

function continueListening(message: string): NextResponse {
  const response = new twiml.VoiceResponse();

  response.say({ voice: "Polly.Matthew" }, message);

  response.record({
    action: "/api/voice/process",
    method: "POST",
    maxLength: 30,
    timeout: 3,
    playBeep: false,
    transcribe: false,
  });

  response.say("Are you still there? Goodbye!");
  response.hangup();

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
