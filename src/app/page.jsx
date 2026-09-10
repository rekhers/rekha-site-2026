"use client";

import styles from "./home.module.css";
import Portrait from "../components/Portrait";

const WAPO_PROJECTS = [
  {
    title: "Pickleball noise is annoying",
    href: "https://www.washingtonpost.com/science/interactive/2025/why-pickleball-noise-is-annoying/",
    image: "/project-previews/pickleball-noise.avif",
  },
  {
    title: "What should EVs sound like?",
    href: "https://www.washingtonpost.com/climate-solutions/interactive/2025/ev-sound-safety-warning/",
    image: "/project-previews/ev-sound.jpg",
  },
  {
    title: "How Mayor Muriel Bowser’s vision changed D.C.",
    href: "https://www.washingtonpost.com/dc-md-va/interactive/2025/dc-mayor-muriel-bowser-legacy-10-year-anniversary/",
    image: "/project-previews/bowser-legacy.jpg",
  },
  {
    title: "AI deepfake voices: Trump & Harris",
    href: "https://www.washingtonpost.com/technology/interactive/2024/ai-voice-detection-trump-harris-deepfake-election/",
    image: "/project-previews/ai-deepfake-voices.avif",
  },
  {
    title: "What the 14th Amendment says",
    href: "https://www.washingtonpost.com/politics/interactive/2024/14th-amendment-trump-ballot/",
    image: "/project-previews/fourteenth-amendment.avif",
  },
  {
    title: "Can ChatGPT get into Harvard?",
    href: "https://www.washingtonpost.com/technology/interactive/2024/chatgpt-college-essay-ai-harvard-admission/",
    image: "/project-previews/chatgpt-harvard.avif",
  },
  {
    title: "How to talk to an AI",
    href: "https://www.washingtonpost.com/technology/interactive/2023/how-to-talk-ai-chatbot-chatgpt/",
    image: "/project-previews/how-to-talk-ai.avif",
  },
  {
    title: "The Blast Effect",
    href: "https://www.washingtonpost.com/nation/interactive/2023/ar-15-damage-to-human-body/",
    image: "/project-previews/blast-effect.png",
  },
  {
    title: "Puerto Rico Deaths",
    href: "https://www.washingtonpost.com/nation/interactive/2023/puerto-rico-deaths/",
    image: "/project-previews/puerto-rico-deaths.jpg",
  },
  {
    title: "Space Dodgers",
    href: "https://www.washingtonpost.com/technology/interactive/2023/space-debris-game/",
    image: "/project-previews/space-dodgers.webp",
  },
  {
    title: "To live and die in Tijuana",
    href: "https://www.washingtonpost.com/investigations/interactive/2022/tijuana-mexico-fentanyl-crime/",
    image: "/project-previews/tijuana-fentanyl.jpg",
  },
  {
    title: "Cryptocurrency mine noise",
    href: "https://www.washingtonpost.com/business/interactive/2022/cryptocurrency-mine-noise-homes-nc/",
    image: "/project-previews/crypto-mine-noise.avif",
  },
  {
    title: "Halo armor breakdown",
    href: "https://www.washingtonpost.com/technology/interactive/2022/master-chief-armor-halo-infinite-3d/",
    image: "/project-previews/halo-armor.avif",
  },
];

const ARCHIVE_PROJECTS = [
  {
    title: "Halo",
    href: "https://www.washingtonpost.com/technology/interactive/2022/master-chief-armor-halo-infinite-3d/",
    image: "/project-previews/halo-archive.png",
  },
  {
    title: "Xinjiang",
    href: "https://www.newyorker.com/news/a-reporter-at-large/china-xinjiang-prison-state-uighur-detention-camps-prisoner-testimony",
    image: "/project-previews/xinjiang.png",
  },
  {
    title: "Say Their Names",
    href: "https://www.newyorker.com/culture/cover-story/cover-story-2020-06-22",
    image: "/project-previews/say-their-names.jpg",
    focus: "center 35%",
    fit: "cover",
  },
  {
    title: "Five Deeps",
    href: "https://www.newyorker.com/magazine/2020/05/18/thirty-six-thousand-feet-under-the-sea",
    image: "/project-previews/five-deeps.png",
  },
  {
    title: "Celebrity Memoirs",
    href: "https://www.newyorker.com/books/page-turner/celebrity-memoirs-book-reviews",
    image: "/project-previews/celebrity-memoirs.png",
  },
  {
    title: "Covid Hair",
    href: "https://www.newyorker.com/culture/photo-booth/the-unexpected-beauty-of-covid-hair",
    image: "/project-previews/covid-hair.png",
  },
  {
    title: "Vaccine Story",
    href: "https://www.newyorker.com/culture/photo-booth/covid-vaccination-new-yorkers",
    image: "/project-previews/vaccine-story.jpg",
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
    image: "/project-previews/space-junk.png",
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
    <div className={styles.page}>
      <main
        id="about"
        className={styles.main}
      >
        <h1 className={styles.name}>
          Rekha Tenjarla
        </h1>
        <div className={styles.introduction}>
        <div>
        <p className={styles.lead}>
          I’m a creative technologist working across storytelling, interaction, and systems.
        </p>
        <p className={`${styles.lead} ${styles.employment}`}>
          Currently, I work at{" "}
          <a href="https://www.fathom.info/about/#team"><span className={`${styles.organization} ${styles.keepTogether}`}>Fathom Information Design</span></a>.
          <br />
          Before that, I spent a decade designing, developing, and reporting
          interactive news stories at{" "}
          <a href="https://www.washingtonpost.com/people/rekha-tenjarla/"><span className={styles.organization}>The Washington Post</span></a>,{" "}
          <span className={`${styles.organization} ${styles.keepTogether}`}>The New Yorker</span>, and{" "}
          <span className={styles.organization}>The Atlantic</span>.
        </p>
        <p className={styles.experiments}>
          See my sound experiments{" "}
          <a href="/experiments" className="underline">
            here
          </a>
          .
        </p>

        </div>
        <Portrait />
        </div>

        <h2 className={styles.sectionTitle}>
          Selected Work
        </h2>
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
              <div className={`${styles.caption} ${styles.selectedCaption}`}>
                {project.title}
              </div>
            </a>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>
          Projects
        </h2>
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <div className={styles.caption}>
                  {project.title}
                </div>
              </div>
            </a>
          ))}
        </div>
        <footer className={styles.contact}>
          Get in touch{" "}
          <a href="mailto:rekha.tenjarla@gmail.com">rekha.tenjarla@gmail.com</a>.
        </footer>
      </main>
    </div>
  );
}
