import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import BioAccordion from "@/components/BioAccordion";
import CemeteryMap from "@/components/CemeteryMap";
import MemorialChat from "@/components/MemorialChat";
import { getMemorial, memorials } from "@/data/memorials";

export function generateStaticParams() {
  return memorials.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }) {
  const m = getMemorial(params.id);
  return {
    title: m
      ? `${m.name} (${m.born}–${m.died}) · Memoriam`
      : "Memorial not found",
    description: m
      ? `A memorial page remembering ${m.name}, ${m.born}–${m.died}.`
      : undefined,
  };
}

export default function MemorialPage({ params }) {
  const memorial = getMemorial(params.id);
  if (!memorial) notFound();

  return (
    <>
      <Header />
      {/*
        Mobile:  profile → bio → map → chat (stacked, full width)
        Laptop:  profile → bio → map | chat (side by side)
      */}
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 pt-6 md:space-y-8 md:px-8 md:pt-10">
        <ProfileCard memorial={memorial} />
        <BioAccordion sections={memorial.sections} />
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <CemeteryMap memorial={memorial} />
          <MemorialChat memorial={memorial} />
        </div>
        <p className="text-center text-xs text-sand-300">
          Memoriam prototype.
        </p>
      </main>
    </>
  );
}
