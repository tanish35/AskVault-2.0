import { redis } from "@/lib/redis";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const TTL = 10 * 60;

const key = (callSid: string) => `voice:session:${callSid}`;

export async function getSession(callSid: string): Promise<Message[]> {
  return (await redis.get<Message[]>(key(callSid))) ?? [];
}

export async function saveSession(
  callSid: string,
  session: Message[]
): Promise<void> {
  await redis.set(key(callSid), session, { ex: TTL });
}

export async function clearSession(callSid: string): Promise<void> {
  await redis.del(key(callSid));
}
