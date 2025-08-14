// api/leaderboard.ts
export const config = { runtime: "edge" };

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv(); // lit UPSTASH_REDIS_* depuis Vercel

type Entry = {
  name: string;
  score: number;      // total points
  percent: number;    // ex: 87.5 (pas 0.875)
  date?: number;      // timestamp ms
};

export default async function handler(req: Request) {
  if (req.method === "GET") {
    const items = await redis.lrange<string>("hta-leaderboard", 0, -1);
    const parsed: Entry[] = items.map((s) => JSON.parse(s));
    // tri score décroissant, puis plus récent en premier
    parsed.sort((a, b) => b.score - a.score || (b.date ?? 0) - (a.date ?? 0));
    return new Response(JSON.stringify(parsed.slice(0, 100)), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  if (req.method === "POST") {
    const body = (await req.json().catch(() => null)) as Partial<Entry> | null;
    if (!body || typeof body.name !== "string" || typeof body.score !== "number" || typeof body.percent !== "number") {
      return new Response("Bad Request", { status: 400 });
    }
    const entry: Entry = {
      name: body.name.trim().slice(0, 40) || "Anonyme",
      score: Math.max(0, Math.floor(body.score)),
      percent: Math.max(0, Math.min(100, Number(body.percent))),
      date: Date.now(),
    };
    await redis.lpush("hta-leaderboard", JSON.stringify(entry));
    await redis.ltrim("hta-leaderboard", 0, 999); // garde les 1000 plus récents
    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
