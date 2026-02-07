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
    image: "https://rekhers.github.io/kadir-nelson.0a3723aa.png",
    focus: "center 35%",
    fit: "contain",
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
    image: "https://rekhers.github.io/vax-story.ea5cfa7d.png",
    focus: "center 35%",
    fit: "contain",
  },
  {
    title: "24 hours",
    href: "https://www.newyorker.com/magazine/2020/05/04/twenty-four-hours-at-the-epicenter-of-the-coronavirus-pandemic",
    image: "https://rekhers.github.io/24-hours.a4f534db.png",
    focus: "center 30%",
    fit: "contain",
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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="relative flex h-screen w-full max-w-4xl flex-col items-center justify-center px-6 sm:px-12 lg:px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            <a
              className={"title playfair-display"}
              href={"https://www.washingtonpost.com/people/rekha-tenjarla/"}
            >
              {" "}
              Rekha Tenjarla
            </a>
          </h1>
        </div>
        <a
          href="#about"
          aria-label="Jump to about section"
          className="seal-link group absolute bottom-10 inline-flex items-center justify-center text-zinc-800 dark:text-zinc-200"
        >
          <span className="seal-outer" aria-hidden="true"></span>
          <span className="seal-inner" aria-hidden="true"></span>
          <span className="seal-bar" aria-hidden="true"></span>
          <span className="seal-arrow">↓</span>
        </a>
      </main>
      <section
        id="about"
        className="w-full max-w-5xl px-6 pb-24 pt-12 text-black dark:text-zinc-50 scroll-mt-12 sm:px-12 lg:px-16"
      >
        <h2 className="text-xl font-semibold tracking-tight">About</h2>
        <p className="mt-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          Senior creative technologist focused on interactive and experimental
          storytelling. Previously part of The Lede Lab at The Washington Post
          and an editorial interactives developer at The New Yorker, where she
          contributed to award-winning immersive projects. BA in linguistics,
          University of Massachusetts Amherst.
        </p>

        <h3 className="mt-10 text-lg font-semibold tracking-tight">Projects</h3>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <a
              key={project.href}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-black"
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
              <div className="px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {project.title}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
