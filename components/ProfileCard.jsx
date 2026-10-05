export default function ProfileCard({ memorial }) {
  const initials = memorial.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <section
      aria-label="Identity"
      className="grid grid-cols-[auto_1fr] items-center gap-4 md:gap-8"
    >
      {/* Circular portrait: 96px on phones, 160px on laptops */}
      <div className="h-24 w-24 overflow-hidden rounded-full bg-sand-200 shadow-card md:h-40 md:w-40">
        {memorial.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memorial.photo}
            alt={`Portrait of ${memorial.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-serif text-3xl text-forest-900 md:text-6xl">
            {initials}
          </div>
        )}
      </div>

      <div className="card px-5 py-4 md:px-8 md:py-7">
        <h1 className="font-serif text-2xl leading-tight md:text-5xl">
          {memorial.name}
        </h1>
        {/* The years are the emotional centre of the page, so they get room */}
        <p className="mt-2 font-serif text-lg tracking-[0.2em] text-sand-200 md:mt-3 md:text-3xl">
          {memorial.born} – {memorial.died}
        </p>
      </div>
    </section>
  );
}
