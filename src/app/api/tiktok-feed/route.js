import { NextResponse } from "next/server";

const DEFAULT_USERNAME = "meta_rekha";

const FALLBACK_POSTS = [
  {
    id: "fallback-1",
    desc: "TikTok feed loading fallback.",
    createTime: null,
    diggCount: 0,
    commentCount: 0,
    playCount: 0,
    shareCount: 0,
    cover: "",
    videoUrl: "",
  },
];

const TIKTOK_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/json",
  "accept-language": "en-US,en;q=0.9",
};

function findFeedContainer(value) {
  if (!value || typeof value !== "object") return null;

  if (
    Array.isArray(value.itemList) &&
    value.itemList.length &&
    value.ItemModule &&
    typeof value.ItemModule === "object"
  ) {
    return value;
  }

  for (const key of Object.keys(value)) {
    const result = findFeedContainer(value[key]);
    if (result) return result;
  }
  return null;
}

function extractScriptJson(html) {
  const ids = [
    "__UNIVERSAL_DATA_FOR_REHYDRATION__",
    "SIGI_STATE",
    "__NEXT_DATA__",
  ];
  for (const id of ids) {
    const regex = new RegExp(
      `<script id="${id}" type="application\\/json">([\\s\\S]*?)<\\/script>`
    );
    const match = html.match(regex);
    if (!match) continue;
    const parsed = safeJsonParse(match[1]);
    if (parsed) return parsed;
  }
  return null;
}

function safeJsonParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function readJsonSafely(response) {
  try {
    const text = await response.text();
    return safeJsonParse(text);
  } catch {
    return null;
  }
}

function mapPosts(container, username) {
  return container.itemList
    .map((id) => container.ItemModule[id])
    .filter(Boolean)
    .slice(0, 18)
    .map((item) => ({
      id: item.id,
      desc: item.desc || "",
      createTime: item.createTime || null,
      diggCount: item.stats?.diggCount ?? 0,
      commentCount: item.stats?.commentCount ?? 0,
      playCount: item.stats?.playCount ?? 0,
      shareCount: item.stats?.shareCount ?? 0,
      cover: item.video?.cover || item.video?.originCover || "",
      videoUrl: `https://www.tiktok.com/@${username}/video/${item.id}`,
    }));
}

function mapItems(items, username) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 18).map((item) => ({
    id: item.id || item.itemId || "",
    desc: item.desc || "",
    createTime: item.createTime || null,
    diggCount: item.stats?.diggCount ?? 0,
    commentCount: item.stats?.commentCount ?? 0,
    playCount: item.stats?.playCount ?? 0,
    shareCount: item.stats?.shareCount ?? 0,
    cover: item.video?.cover || item.video?.originCover || "",
    videoUrl:
      item.id || item.itemId
        ? `https://www.tiktok.com/@${username}/video/${item.id || item.itemId}`
        : `https://www.tiktok.com/@${username}`,
  }));
}

function mapTikwmItems(items, username) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 18).map((item) => {
    const id = item.video_id || item.aweme_id || item.id || "";
    return {
      id,
      desc: item.title || item.desc || "",
      createTime: item.create_time || item.createTime || null,
      diggCount: item.digg_count ?? item.diggCount ?? item.stats?.diggCount ?? 0,
      commentCount:
        item.comment_count ?? item.commentCount ?? item.stats?.commentCount ?? 0,
      playCount: item.play_count ?? item.playCount ?? item.stats?.playCount ?? 0,
      shareCount: item.share_count ?? item.shareCount ?? item.stats?.shareCount ?? 0,
      cover:
        item.cover || item.origin_cover || item.thumbnail || item.cover_hd || "",
      videoUrl: id
        ? `https://www.tiktok.com/@${username}/video/${id}`
        : `https://www.tiktok.com/@${username}`,
    };
  });
}

function extractSecUid(html) {
  const match = html.match(/"secUid":"([^"]+)"/);
  return match?.[1] || null;
}

function scrapeUrlebird(html, username) {
  const idMatches = Array.from(
    html.matchAll(/\/video\/(\d{10,22})/g),
    (m) => m[1]
  );
  const uniqueIds = [...new Set(idMatches)].slice(0, 18);
  return uniqueIds.map((id) => ({
    id,
    desc: "",
    createTime: null,
    diggCount: 0,
    commentCount: 0,
    playCount: 0,
    shareCount: 0,
    cover: "",
    videoUrl: `https://www.tiktok.com/@${username}/video/${id}`,
  }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || DEFAULT_USERNAME).replace(
    /^@/,
    ""
  );

  const profileUrl = `https://www.tiktok.com/@${username}`;
  const attempts = [];

  try {
    const response = await fetch(profileUrl, {
      headers: TIKTOK_HEADERS,
      cache: "no-store",
    });

    if (response.ok) {
      const html = await response.text();

      // Strategy 1: parse rehydration blob from profile HTML.
      const parsed = extractScriptJson(html);
      const container = parsed ? findFeedContainer(parsed) : null;
      if (container) {
        const posts = mapPosts(container, username);
        if (posts.length) {
          return NextResponse.json({
            ok: true,
            username,
            profileUrl,
            posts,
            source: "profile-rehydration",
          });
        }
      } else {
        attempts.push("profile-rehydration-miss");
      }

      // Strategy 2: extract secUid from HTML and hit item list API.
      const secUid = extractSecUid(html);
      if (secUid) {
        const apiUrl = new URL("https://www.tiktok.com/api/post/item_list/");
        apiUrl.searchParams.set("aid", "1988");
        apiUrl.searchParams.set("count", "18");
        apiUrl.searchParams.set("cursor", "0");
        apiUrl.searchParams.set("secUid", secUid);
        apiUrl.searchParams.set("sourceType", "8");
        apiUrl.searchParams.set("appId", "1233");

        const listResponse = await fetch(apiUrl.toString(), {
          headers: {
            ...TIKTOK_HEADERS,
            referer: profileUrl,
          },
          cache: "no-store",
        });
        if (listResponse.ok) {
          const listJson = await readJsonSafely(listResponse);
          const posts = mapItems(listJson?.itemList, username);
          if (posts.length) {
            return NextResponse.json({
              ok: true,
              username,
              profileUrl,
              posts,
              source: "item-list-api",
            });
          }
          attempts.push("item-list-empty-or-invalid-json");
        } else {
          attempts.push(`item-list-status-${listResponse.status}`);
        }
      } else {
        attempts.push("secuid-miss");
      }
    } else {
      attempts.push(`profile-status-${response.status}`);
    }

    // Strategy 3: legacy node/share endpoint.
    const nodeUrl = new URL(
      `https://www.tiktok.com/node/share/user/@${username}`
    );
    nodeUrl.searchParams.set("uniqueId", username);
    const nodeResponse = await fetch(nodeUrl.toString(), {
      headers: TIKTOK_HEADERS,
      cache: "no-store",
    });
    if (nodeResponse.ok) {
      const nodeJson = await readJsonSafely(nodeResponse);
      const posts = mapItems(nodeJson?.itemList, username);
      if (posts.length) {
        return NextResponse.json({
          ok: true,
          username,
          profileUrl,
          posts,
          source: "node-share-user",
        });
      }
      attempts.push("node-share-empty-or-invalid-json");
    } else {
      attempts.push(`node-share-status-${nodeResponse.status}`);
    }

    // Strategy 4: public mirror API fallback for server-side reliability.
    const mirrorUrl = new URL("https://www.tikwm.com/api/user/posts");
    mirrorUrl.searchParams.set("unique_id", username);
    mirrorUrl.searchParams.set("count", "18");
    const mirrorResponse = await fetch(mirrorUrl.toString(), {
      headers: TIKTOK_HEADERS,
      cache: "no-store",
    });
    if (mirrorResponse.ok) {
      const mirrorJson = await readJsonSafely(mirrorResponse);
      const posts = mapTikwmItems(mirrorJson?.data?.videos, username);
      if (posts.length) {
        return NextResponse.json({
          ok: true,
          username,
          profileUrl,
          posts,
          source: "tikwm-mirror",
        });
      }
      attempts.push("tikwm-empty-or-invalid-json");
    } else {
      attempts.push(`tikwm-status-${mirrorResponse.status}`);
    }

    // Strategy 5: scrape urlebird mirror for video IDs only.
    const urlebirdUrl = `https://www.urlebird.com/user/${username}/`;
    const urlebirdResponse = await fetch(urlebirdUrl, {
      headers: TIKTOK_HEADERS,
      cache: "no-store",
    });
    if (urlebirdResponse.ok) {
      const urlebirdHtml = await urlebirdResponse.text();
      const posts = scrapeUrlebird(urlebirdHtml, username);
      if (posts.length) {
        return NextResponse.json({
          ok: true,
          username,
          profileUrl,
          posts,
          source: "urlebird-scrape",
        });
      }
      attempts.push("urlebird-empty");
    } else {
      attempts.push(`urlebird-status-${urlebirdResponse.status}`);
    }

    return NextResponse.json(
      {
        ok: false,
        username,
        profileUrl,
        posts: FALLBACK_POSTS,
        source: "fallback",
        error: attempts.join(", ") || "unable to parse profile feed",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        username,
        profileUrl,
        posts: FALLBACK_POSTS,
        source: "fallback",
        error: error.message,
      },
      { status: 200 }
    );
  }
}
