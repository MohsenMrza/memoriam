import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Memorial not found</h1>
        <p className="mt-3 text-sand-200">
          We couldn't find that record. Try searching by name or grave
          location.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-sand-200 px-6 py-3 text-forest-950 shadow-sandcard"
        >
          Back home
        </Link>
      </main>
    </>
  );
}
