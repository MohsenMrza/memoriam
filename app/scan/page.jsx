import Header from "@/components/Header";
import GraveScanner from "@/components/GraveScanner";

export const metadata = { title: "Scan a grave · Memoriam" };

export default function ScanPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 md:px-8 md:pt-12">
        <GraveScanner />
      </main>
    </>
  );
}
