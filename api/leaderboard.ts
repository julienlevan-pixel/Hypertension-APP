// api/leaderboard.ts
import { Redis } from "@upstash/redis";

type Entry = {
  name: string;
  score: number;   // total points
  percent: number; // 0..100
  date?: number;   // timestamp ms
};

// ⚠️ Nécessite UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN dans Vercel → Settings → Environment Variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "no-store");

  if (req.method === "GET") {
    const items = await redis.lrange<string>("hta-leaderboard", 0, -1);
    const parsed: Entry[] = items.map((s: string) => JSON.parse(s));
    // tri: score décroissant puis plus récent
    parsed.sort((a, b) => b.score - a.score || (b.date ?? 0) - (a.date ?? 0));
    res.setHeader("content-type", "application/json");
    res.status(200).send(JSON.stringify(parsed.slice(0, 100)));
    return;
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    const { name, score, percent } = body as Partial<Entry>;

    if (typeof name !== "string" || typeof score !== "number" || typeof percent !== "number") {
      res.status(400).send("Bad Request");
      return;
    }

    const entry: Entry = {
      name: name.trim().slice(0, 40) || "Anonyme",
      score: Math.max(0, Math.floor(score)),
      percent: Math.max(0, Math.min(100, Number(percent))),
      date: Date.now(),
    };

    await redis.lpush("hta-leaderboard", JSON.stringify(entry));
    await redis.ltrim("hta-leaderboard", 0, 999); // garde les 1000 plus récents

    res.setHeader("content-type", "application/json");
    res.status(200).send(JSON.stringify({ ok: true }));
    return;
  }

  res.status(405).send("Method Not Allowed");
}
