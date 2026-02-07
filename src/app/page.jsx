import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="text-container">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            <a
              className={"title playfair-display"}
              href={"https://www.washingtonpost.com/people/rekha-tenjarla/"}
            >
              {" "}
              Rekha Tenjarla
            </a>
          </h1>

          <p className="subhed">
            Under Construction{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className=""
            ></a>{" "}
          </p>
        </div>
      </main>
    </div>
  );
}
