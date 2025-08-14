// api/leaderboard.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";

type Entry = {
  name: string;
  score: number;   // points
  percent: number; // 0..100
  date?: number;   // timestamp ms
};

// Supporte Upstash classique OU Vercel KV
const URL_FROM_ENV =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN_FROM_ENV =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const kvReady = Boolean(URL_FROM_ENV && TOKEN_FROM_ENV);
const redis = kvReady
  ? new Redis({ url: URL_FROM_ENV as string, token: TOKEN_FROM_ENV as string })
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("cache-control", "no-store");

  // Debug léger: /api/leaderboard?debug=1 pour vérifier les ENV
  if (req.method === "GET" && req.query?.debug === "1") {
    return res.status(200).json({
      kvReady,
      hasUrl: Boolean(URL_FROM_ENV),
      hasToken: Boolean(TOKEN_FROM_ENV),
      // on ne renvoie PAS les valeurs pour des raisons de sécu
    });
  }

  if (req.method === "GET") {
    if (!kvReady) {
      // Pas de KV dispo => on retourne une liste vide (gracieux)
      return res.status(200).json([]);
    }
    try {
      const items = await redis!.lrange<string>("hta-leaderboard", 0, -1);
      const parsed: Entry[] = items.map((s: string) => JSON.parse(s));
      // tri: score desc, puis date plus récente
      parsed.sort((a, b) => b.score - a.score || (b.date ?? 0) - (a.date ?? 0));
      return res.status(200).json(parsed.slice(0, 100));
    } catch (e: any) {
      return res.status(502).json({ error: "Upstash read error", message: e?.message });
    }
  }

  if (req.method === "POST") {
    if (!kvReady) {
      return res.status(503).send("Leaderboard disabled: missing KV env (URL/TOKEN).");
    }

    let body: any = req.body;
    // Certains environnements ne parsèrent pas auto le JSON
    if (!body || typeof body !== "object") {
      try {
        body = JSON.parse((req as any).body || "{}");
      } catch {
        body = {};
      }
    }

    const { name, score, percent } = body as Partial<Entry>;
    if (typeof name !== "string" || typeof score !== "number" || typeof percent !== "number") {
      return res.status(400).json({ error: "Bad Request: name(string), score(number), percent(number) expected." });
    }

    const entry: Entry = {
      name: name.trim().slice(0, 40) || "Anonyme",
      score: Math.max(0, Math.floor(score)),
      percent: Math.max(0, Math.min(100, Number(percent))),
      date: Date.now(),
    };

    try {
      await redis!.lpush("hta-leaderboard", JSON.stringify(entry));
      await redis!.ltrim("hta-leaderboard", 0, 999); // garde 1000 max
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(502).json({ error: "Upstash write error", message: e?.message });
    }
  }

  res.setHeader("allow", "GET, POST");
  return res.status(405).send("Method Not Allowed");
}
