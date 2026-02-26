"use client";

import { useEffect, useRef, useState } from "react";

const WAPO_PROJECTS = [
  {
    title: "Pickleball noise is annoying",
    href: "https://www.washingtonpost.com/science/interactive/2025/why-pickleball-noise-is-annoying/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2F74ABXIPLWBCBBBWNAZTK4UCH2Q.jpg&w=300",
  },
  {
    title: "What should EVs sound like?",
    href: "https://www.washingtonpost.com/climate-solutions/interactive/2025/ev-sound-safety-warning/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FZE7WQSZUVRE7RGEN3PEFNSJYX4.png&w=300",
  },
  {
    title: "How Mayor Muriel Bowser’s vision changed D.C.",
    href: "https://www.washingtonpost.com/dc-md-va/interactive/2025/dc-mayor-muriel-bowser-legacy-10-year-anniversary/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FJDPWHE7LLJHFPLCT4KNGI2GG44.png&w=300",
  },
  {
    title: "AI deepfake voices: Trump & Harris",
    href: "https://www.washingtonpost.com/technology/interactive/2024/ai-voice-detection-trump-harris-deepfake-election/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2F3GNCSO7ALRHWLOLTSO6TG534RE.jpg&w=300",
  },
  {
    title: "What the 14th Amendment says",
    href: "https://www.washingtonpost.com/politics/interactive/2024/14th-amendment-trump-ballot/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FZO3Q6GFS2RFPVNTUVGZDGNY4PY.jpg&w=300",
  },
  {
    title: "Can ChatGPT get into Harvard?",
    href: "https://www.washingtonpost.com/technology/interactive/2024/chatgpt-college-essay-ai-harvard-admission/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FHKWGL42RSNEXFDTSJ6MYSNYFOY.png&w=300",
  },
  {
    title: "How to talk to an AI",
    href: "https://www.washingtonpost.com/technology/interactive/2023/how-to-talk-ai-chatbot-chatgpt/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FKK4QILC7RJDP7IGXGBPVQITL6Q.jpg&w=300",
  },
  {
    title: "The Blast Effect",
    href: "https://www.washingtonpost.com/nation/interactive/2023/ar-15-damage-to-human-body/",
    image: "/blast-effect.png",
  },
  {
    title: "Puerto Rico Deaths",
    href: "https://www.washingtonpost.com/nation/interactive/2023/puerto-rico-deaths/",
    image: "/puerto-rico-deaths.png",
  },
  {
    title: "Space Dodgers",
    href: "https://www.washingtonpost.com/technology/interactive/2023/space-debris-game/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FZ62TUMZXCRHCHC6MDCWGOZ2CS4.png&w=300",
  },
  {
    title: "To live and die in Tijuana",
    href: "https://www.washingtonpost.com/investigations/interactive/2022/tijuana-mexico-fentanyl-crime/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FAZGAT6UMXPTYASKTC5F3QKPKDA.JPG&w=300",
  },
  {
    title: "Cryptocurrency mine noise",
    href: "https://www.washingtonpost.com/business/interactive/2022/cryptocurrency-mine-noise-homes-nc/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FNBRRCOQNEQI63CHIYWG4HW5O4I.jpg&w=300",
  },
  {
    title: "Halo armor breakdown",
    href: "https://www.washingtonpost.com/technology/interactive/2022/master-chief-armor-halo-infinite-3d/",
    image:
      "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost.s3.amazonaws.com%2Fpublic%2FHJKUBRRLQZG7DKY436DVGHJIKI.jpg&w=300",
  },
];

const ARCHIVE_PROJECTS = [
  {
    title: "Halo",
    href: "https://www.washingtonpost.com/technology/interactive/2022/master-chief-armor-halo-infinite-3d/",
    image: "https://rekhers.github.io/halo.e10294da.png",
  },
  {
    title: "Xinjiang",
    href: "https://www.newyorker.com/news/a-reporter-at-large/china-xinjiang-prison-state-uighur-detention-camps-prisoner-testimony",
    image: "https://rekhers.github.io/xinjiang.8efd75d3.png",
  },
  {
    title: "Say Their Names",
    href: "https://www.newyorker.com/culture/cover-story/cover-story-2020-06-22",
    image:
      "https://downloads.newyorker.com/projects/2020/200622-cover-nelson/nelson.jpg",
    focus: "center 35%",
    fit: "cover",
  },
  {
    title: "Five Deeps",
    href: "https://www.newyorker.com/magazine/2020/05/18/thirty-six-thousand-feet-under-the-sea",
    image: "https://rekhers.github.io/five-deeps.71d967ee.png",
  },
  {
    title: "Celebrity Memoirs",
    href: "https://www.newyorker.com/books/page-turner/celebrity-memoirs-book-reviews",
    image: "https://rekhers.github.io/celebrity-memoirs.cc88c27b.png",
  },
  {
    title: "Covid Hair",
    href: "https://www.newyorker.com/culture/photo-booth/the-unexpected-beauty-of-covid-hair",
    image: "https://rekhers.github.io/covid-hair.1fbfc4fb.png",
  },
  {
    title: "Vaccine Story",
    href: "https://www.newyorker.com/culture/photo-booth/covid-vaccination-new-yorkers",
    image:
      "https://downloads.newyorker.com/projects/2021/210423-rosner-portfolio/images/desktop/opener_daniel_d.jpg",
    focus: "center 35%",
    fit: "cover",
  },
  {
    title: "24 hours",
    href: "https://www.newyorker.com/magazine/2020/05/04/twenty-four-hours-at-the-epicenter-of-the-coronavirus-pandemic",
    image: "/24-hours.png",
    focus: "center 30%",
    fit: "cover",
  },
  {
    title: "Space Junk",
    href: "https://www.newyorker.com/magazine/2020/09/28/the-elusive-peril-of-space-junk",
    image: "https://rekhers.github.io/space-junk.f22e6be3.png",
  },
];

const PROJECTS = [
  ...WAPO_PROJECTS,
  ...ARCHIVE_PROJECTS.filter(
    (project) => !WAPO_PROJECTS.some((item) => item.href === project.href)
  ),
];

const SELECTED_WORK = [
  {
    title: "AI deepfake voices: Trump & Harris",
    href: "https://www.washingtonpost.com/technology/interactive/2024/ai-voice-detection-trump-harris-deepfake-election/",
    video: "/selected/ai-audio-screengrab.mov",
    poster: "/selected/ai-audio-poster.jpg",
  },
  {
    title: "What should EVs sound like?",
    href: "https://www.washingtonpost.com/climate-solutions/interactive/2025/ev-sound-safety-warning/",
    video: "/selected/ev-screengrab.mov",
    poster: "/selected/ev-poster.jpg",
  },
  {
    title: "Space Dodgers",
    href: "https://www.washingtonpost.com/technology/interactive/2023/space-debris-game/",
    video: "/selected/space-game.mov",
    poster: "/selected/space-game-poster.jpg",
  },
  {
    title: "Can ChatGPT get into Harvard?",
    href: "https://www.washingtonpost.com/technology/interactive/2024/chatgpt-college-essay-ai-harvard-admission/",
    video: "/selected/chatgpt-screengrab.mov",
    poster: "/selected/chatgpt-poster.jpg",
  },
];

export default function Home() {
  const [hz, setHz] = useState(440);
  const isDraggingRef = useRef(false);
  const trailRef = useRef(null);

  useEffect(() => {
    let raf = null;
    const handleMove = (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const h = window.innerHeight || 1;
        const norm = 1 - Math.min(Math.max(event.clientY / h, 0), 1);
        const min = 20;
        const max = 20000;
        const value = Math.round(min * Math.pow(max / min, norm));
        setHz(value);
        raf = null;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const handleVideoEnter = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleVideoLeave = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const handleVideoTap = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main
        className="relative flex h-screen w-full flex-col items-center justify-center px-0 bg-white dark:bg-black cursor-crosshair touch-none"
        onPointerDown={(event) => {
          if (event.target.closest(".seal-link")) return;
          isDraggingRef.current = true;
          if (event.currentTarget.setPointerCapture) {
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerUp={(event) => {
          if (event.target.closest(".seal-link")) return;
          isDraggingRef.current = false;
          if (event.currentTarget.releasePointerCapture) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerLeave={(event) => {
          isDraggingRef.current = false;
        }}
        onPointerMove={(event) => {
          if (!isDraggingRef.current || !trailRef.current) return;
          const dot = document.createElement("span");
          dot.className = "iridescent-trail";
          dot.style.left = `${event.clientX}px`;
          dot.style.top = `${event.clientY}px`;
          trailRef.current.appendChild(dot);
          window.setTimeout(() => {
            dot.remove();
          }, 900);
        }}
        onTouchStart={(event) => {
          if (event.target.closest(".seal-link")) return;
          isDraggingRef.current = true;
        }}
        onTouchEnd={() => {
          isDraggingRef.current = false;
        }}
        onTouchMove={(event) => {
          event.preventDefault();
          if (!isDraggingRef.current || !trailRef.current) return;
          const touch = event.touches[0];
          if (!touch) return;
          const dot = document.createElement("span");
          dot.className = "iridescent-trail";
          dot.style.left = `${touch.clientX}px`;
          dot.style.top = `${touch.clientY}px`;
          trailRef.current.appendChild(dot);
          window.setTimeout(() => {
            dot.remove();
          }, 900);
        }}
      >
        <div ref={trailRef} className="trail-layer" aria-hidden="true" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center -translate-y-[10%] sm:translate-y-0">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            <a
              className="title playfair-display select-none peer"
              href="/"
              aria-label="Home"
            >
              Rekha Tenjarla
            </a>
          </h1>
        </div>
        <div className="absolute left-2 top-4 z-20 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 pl-2">
          λ {hz.toLocaleString()} Hz
          <span className="ml-3 opacity-0 transition-opacity duration-200 peer-hover:opacity-100">
            drag
          </span>
        </div>
        <button
          type="button"
          aria-label="Jump to about section"
          className="seal-link group absolute bottom-10 z-20 inline-flex items-center justify-center text-zinc-800 dark:text-zinc-200 pointer-events-auto sm:bottom-10 bottom-[18%]"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={() => {
            const target = document.getElementById("about");
            if (!target) return;
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: "smooth" });
          }}
          onPointerUp={() => {
            const target = document.getElementById("about");
            if (!target) return;
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: "smooth" });
          }}
        >
          <span className="seal-outer" aria-hidden="true"></span>
          <span className="seal-inner" aria-hidden="true"></span>
          <span className="seal-bar" aria-hidden="true"></span>
          <span className="seal-arrow">↓</span>
        </button>
        {null}
      </main>
      <section
        id="about"
        className="w-full max-w-5xl px-6 pb-24 pt-12 text-black dark:text-zinc-50 scroll-mt-12 sm:px-12 lg:px-16"
      >
        <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-600">
          About
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          I am a senior creative technologist, still technically employed by{" "}
          <a
            href="https://www.washingtonpost.com/people/rekha-tenjarla/"
            className="underline"
          >
            The Washington Post
          </a>{" "}
          until May. Previously, I worked at The New Yorker and The Atlantic.
        </p>
        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          I've been called a software engineer, a designer, and other things,
          but "creative technologist" feels most accurate. I'm a technical
          generalist—this site runs on a VPS I manage myself—but I'm most
          interested in interactive experiences, storytelling, and visualizing
          sound.
        </p>
        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          See my experiments{" "}
          <a href="/experiments" className="underline">
            here
          </a>
          .
        </p>

        <h3 className="mt-10 text-sm uppercase tracking-[0.2em] text-zinc-600">
          Selected work
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SELECTED_WORK.map((project) => (
            <a
              key={project.href}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-black"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div
                  className="selected-video"
                  onMouseEnter={handleVideoEnter}
                  onMouseLeave={handleVideoLeave}
                  onFocus={handleVideoEnter}
                  onBlur={handleVideoLeave}
                  onClick={handleVideoTap}
                  onTouchStart={handleVideoTap}
                >
                  <video
                    className="h-full w-full object-cover object-center"
                    src={project.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={project.poster}
                  />
                </div>
              </div>
              <div className="px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {project.title}
              </div>
            </a>
          ))}
        </div>

        <h3 className="mt-12 text-sm uppercase tracking-[0.2em] text-zinc-600">
          Projects
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <a
              key={project.href}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-sm dark:border-zinc-700 dark:bg-black"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
                  style={{
                    objectPosition: project.focus || "center",
                    objectFit: project.fit || "cover",
                  }}
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-200 group-hover:opacity-100">
                <span className="px-4 py-3 text-sm font-medium text-white">
                  {project.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
