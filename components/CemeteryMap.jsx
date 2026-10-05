// Static SVG stand-in for the future interactive map (Mapbox / Leaflet).
export default function CemeteryMap({ memorial }) {
  return (
    <section
      aria-label="Cemetery map"
      className="flex h-full flex-col rounded-3xl border-4 border-sand-200 bg-forest-950 p-0 shadow-card"
    >
      <div className="relative flex-1 overflow-hidden rounded-[1.2rem]">
        <svg
          viewBox="0 0 400 300"
          className="h-full min-h-[260px] w-full"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={`Map showing ${memorial.cemetery}, Section ${memorial.section}, Plot ${memorial.plot}`}
        >
          <rect width="400" height="300" fill="#1e4330" />
          {/* soft terrain blobs */}
          <path
            d="M0 40 C60 10 130 20 160 80 C185 130 120 170 60 160 C20 152 0 140 0 140Z"
            fill="#3e6350"
          />
          <path
            d="M250 120 C300 70 380 90 400 130 L400 300 L230 300 C200 230 210 160 250 120Z"
            fill="#2c5240"
          />
          <path
            d="M120 190 C160 170 210 190 200 240 C190 285 130 290 100 260 C85 240 95 205 120 190Z"
            fill="#356049"
          />
          {/* paths */}
          <g
            fill="none"
            stroke="#f4ecd9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 105 C60 100 110 95 150 70" />
            <path d="M150 70 C175 110 160 150 130 185 C100 220 40 230 0 215" />
            <path d="M60 160 L130 185" />
            <path d="M150 70 C200 50 250 70 280 110 C310 150 320 190 300 240" />
            <path d="M130 185 C170 195 230 175 280 200 C310 215 300 240 300 240" />
          </g>
          {/* section labels */}
          <g
            fill="#e8dcc0"
            fontSize="14"
            fontFamily="Georgia, serif"
            opacity="0.85"
          >
            <text x="20" y="75">A</text>
            <text x="85" y="135">B</text>
            <text x="200" y="130">C</text>
            <text x="230" y="250">D</text>
          </g>
          {/* entrance */}
          <rect x="18" y="262" width="26" height="14" rx="2" fill="#bdb6a6" />
          <text
            x="52"
            y="274"
            fill="#e8dcc0"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
          >
            Entrance
          </text>
          {/* grave marker */}
          <circle cx="210" cy="150" r="16" fill="#f4ecd9" opacity="0.25">
            <animate
              attributeName="r"
              values="10;22;10"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="210"
            cy="150"
            r="9"
            fill="none"
            stroke="#f4ecd9"
            strokeWidth="5"
          />
        </svg>

        {/* zoom controls (visual only in the prototype) */}
        <div
          className="absolute right-3 top-2 flex gap-2 text-3xl font-bold leading-none text-sand-200/90"
          aria-hidden
        >
          <span>+</span>
          <span>−</span>
        </div>
      </div>

      <div className="rounded-b-[1.2rem] bg-sand-200 px-4 py-3 text-forest-950">
        <p className="font-serif text-lg leading-tight">
          Section {memorial.section} · Plot {memorial.plot}
        </p>
        <p className="text-xs text-sand-500">{memorial.cemetery}</p>
      </div>
    </section>
  );
}
