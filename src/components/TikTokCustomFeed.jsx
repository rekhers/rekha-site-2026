"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

function formatNumber(value) {
  if (!value) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

function formatDate(unix) {
  if (!unix) return "";
  return new Date(unix * 1000).toLocaleDateString();
}

export default function TikTokCustomFeed({ username = "meta_rekha" }) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    posts: [],
    profileUrl: `https://www.tiktok.com/@${username}`,
    source: "fallback",
  });
  const [clientPosts, setClientPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadFeed() {
      try {
        const response = await fetch(
          `/api/tiktok-feed?username=${encodeURIComponent(username)}`
        );
        const data = await response.json();
        if (!mounted) return;

        setState({
          loading: false,
          error: data.error || "",
          posts: data.posts || [],
          profileUrl: data.profileUrl || `https://www.tiktok.com/@${username}`,
          source: data.source || "fallback",
        });
      } catch (error) {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    }

    loadFeed();
    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    let mounted = true;

    async function loadClientFallback() {
      if (state.loading || state.source !== "fallback") return;
      try {
        const url = `https://www.tikwm.com/api/user/posts?unique_id=${encodeURIComponent(
          username
        )}&count=18`;
        const response = await fetch(url);
        const data = await response.json();
        const videos = Array.isArray(data?.data?.videos) ? data.data.videos : [];
        const mapped = videos.slice(0, 18).map((item) => ({
          id: item.video_id || item.aweme_id || item.id,
          desc: item.title || item.desc || "",
          createTime: item.create_time || item.createTime || null,
          diggCount: item.digg_count ?? item.stats?.diggCount ?? 0,
          commentCount: item.comment_count ?? item.stats?.commentCount ?? 0,
          playCount: item.play_count ?? item.stats?.playCount ?? 0,
          cover:
            item.cover || item.origin_cover || item.thumbnail || item.cover_hd || "",
          videoUrl: `https://www.tiktok.com/@${username}/video/${
            item.video_id || item.aweme_id || item.id
          }`,
        }));

        if (mounted) {
          setClientPosts(mapped.filter((item) => item.id));
        }
      } catch {
        if (mounted) setClientPosts([]);
      }
    }

    loadClientFallback();
    return () => {
      mounted = false;
    };
  }, [state.loading, state.source, username]);

  return (
    <section className="tiktok-shell">
      <Script src="https://www.tiktok.com/embed.js" strategy="afterInteractive" />
      <header className="tiktok-header">
        <div>
          <p className="tiktok-kicker">Synths / Music</p>
          <h2 className="tiktok-title">@{username}</h2>
        </div>
        <a href={state.profileUrl} target="_blank" rel="noreferrer">
          Open Profile
        </a>
      </header>

      <p className="tiktok-status">
        {state.loading
          ? "Loading feed..."
          : state.source !== "fallback"
          ? "Live profile feed"
          : "Fallback feed (TikTok blocked parse, using official embed)"}
      </p>
      {!state.loading ? (
        <p className="tiktok-status">Source: {state.source}</p>
      ) : null}

      {state.error ? <p className="tiktok-error">Error: {state.error}</p> : null}

      {state.source !== "fallback" || clientPosts.length > 0 ? (
        <div className="tiktok-grid">
          {(clientPosts.length > 0 ? clientPosts : state.posts).map((post) => (
            <article key={post.id} className="tiktok-card">
              <a
                href={post.videoUrl || state.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="tiktok-thumb"
              >
                {post.cover ? (
                  <img src={post.cover} alt={post.desc || "TikTok cover"} />
                ) : (
                  <div className="tiktok-thumb-fallback">No Thumbnail</div>
                )}
              </a>
              <div className="tiktok-meta">
                <p>{post.desc || "No caption"}</p>
                <div className="tiktok-stats">
                  <span>{formatNumber(post.playCount)} plays</span>
                  <span>{formatNumber(post.diggCount)} likes</span>
                  <span>{formatNumber(post.commentCount)} comments</span>
                  <span>{formatDate(post.createTime)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="tiktok-embed-wrap">
          <blockquote
            className="tiktok-embed"
            cite={`https://www.tiktok.com/@${username}`}
            data-unique-id={username}
            data-embed-from="embed_page"
            style={{ maxWidth: "780px", minWidth: "320px" }}
          >
            <section>
              <a href={`https://www.tiktok.com/@${username}`} target="_blank" rel="noreferrer">
                @{username}
              </a>
            </section>
          </blockquote>
          <a
            className="tiktok-open-direct"
            href={`https://www.tiktok.com/@${username}`}
            target="_blank"
            rel="noreferrer"
          >
            Open @{username} directly
          </a>
        </div>
      )}
    </section>
  );
}
