import { NextResponse } from "next/server";
import { twiml } from "twilio";
import { redis } from "@/lib/redis";
import { resultKey, continueListening, type ProcessingState } from "../route";

const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL = 5;

export async function POST(req: Request) {
  const url = new URL(req.url);
  const callSid = url.searchParams.get("callSid");

  if (!callSid) {
    return continueListening("Something went wrong. Please try again.");
  }

  try {
    const state = await redis.get<ProcessingState>(resultKey(callSid));

    if (!state) {
      console.error(`[${callSid}] No processing state found`);
      return continueListening("Something went wrong. Please try again.");
    }

    if (state.status === "complete" && state.result) {
      console.log(`[${callSid}] Processing complete, returning result`);
      await redis.del(resultKey(callSid));
      return continueListening(state.result);
    }

    if (state.status === "error" && state.result) {
      console.log(`[${callSid}] Processing error:`, state.result);
      await redis.del(resultKey(callSid));
      return continueListening(state.result);
    }
    const attempts = (state.attempts || 0) + 1;

    if (attempts >= MAX_POLL_ATTEMPTS) {
      console.error(`[${callSid}] Max poll attempts exceeded`);
      await redis.del(resultKey(callSid));
      return continueListening(
        "I'm taking too long to process that. Please try again."
      );
    }
    await redis.set<ProcessingState>(
      resultKey(callSid),
      { ...state, attempts },
      { ex: 300 }
    );
    console.log(`[${callSid}] Still processing, poll attempt ${attempts}`);
    return keepWaiting(callSid, attempts);
  } catch (err) {
    console.error(`[${callSid}] Poll error:`, err);
    return continueListening("Something went wrong. Please try again.");
  }
}

function keepWaiting(callSid: string, attempts: number): NextResponse {
  const response = new twiml.VoiceResponse();
  if (attempts % 6 === 0) {
    response.say(
      { voice: "Polly.Matthew" },
      "Still working on that. Please hold."
    );
  } else if (attempts % 12 === 0) {
    response.say(
      { voice: "Polly.Matthew" },
      "Almost there. Thank you for your patience."
    );
  }
  response.pause({ length: POLL_INTERVAL });
  response.redirect(
    { method: "POST" },
    `/api/voice/process/poll?callSid=${encodeURIComponent(callSid)}`
  );

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
