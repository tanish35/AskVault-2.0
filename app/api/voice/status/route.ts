import { clearSession } from "@/lib/voice/redisSessionMemory";

export async function POST(req: Request) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid") as string;
  const status = formData.get("CallStatus");

  if (status === "completed") {
    await clearSession(callSid);
  }

  return new Response("ok");
}
