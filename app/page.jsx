import Link from "next/link";
import Header from "@/components/Header";
import { memorials } from "@/data/memorials";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 md:px-8 md:pt-16">
        <section className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-sand-300">
            Memoriam
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-sand-100 md:text-6xl">
            More than a name and two dates.
          </h1>
          <p className="mt-5 text-lg text-sand-200/90 md:text-xl">
            Preserve who they were: their stories, their family, their
            legacy. Search a name, or scan a headstone to open a memorial.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/scan"
              className="rounded-full bg-sand-200 px-6 py-3 font-medium text-forest-950 shadow-sandcard transition hover:-translate-y-0.5"
            >
              Scan a grave
            </Link>
            <Link
              href={`/memorial/${memorials[0].id}`}
              className="rounded-full border border-sand-300/60 px-6 py-3 font-medium text-sand-100 transition hover:bg-forest-800"
            >
              View an example
            </Link>
          </div>
        </section>

        <section className="mt-14 md:mt-20">
          <h2 className="font-serif text-2xl text-sand-200">Recent memorials</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {memorials.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/memorial/${m.id}`}
                  className="card flex h-full flex-col items-center p-6 text-center transition hover:-translate-y-1"
                >
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-sand-200 font-serif text-3xl text-forest-900">
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="mt-4 font-serif text-xl">{m.name}</span>
                  <span className="mt-1 text-sand-200">
                    {m.born} – {m.died}
                  </span>
                  <span className="mt-2 text-xs text-sand-300">
                    Section {m.section} · Plot {m.plot}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-sand-300">
            Memoriam prototype.
          </p>
        </section>
      </main>
    </>
  );
}
