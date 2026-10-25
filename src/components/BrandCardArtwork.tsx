import type { BrandPreset } from "@/lib/brands";

export function BrandCardArtwork({ face }: { face: BrandPreset["face"] | null }) {
  if (!face) return null;

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {face === "plusmore" && (
        <>
          <path d="M243 0h157v200H158c44-26 81-61 85-111V0Z" fill="#673f99" />
          <path d="M276 0h124v200H211c39-35 60-79 65-130V0Z" fill="#20a45a" />
          <path d="M315 0h85v200H259c33-44 49-91 56-145V0Z" fill="#1681c4" />
          <path d="M352 0h48v200H303c27-54 40-110 49-165V0Z" fill="#ef5682" />
        </>
      )}
      {face === "checkers" && (
        <>
          <path d="M280 0h120v200H192L280 0Z" fill="#168274" />
          <path d="M333 0h67v200h-96c40-54 40-131 29-200Z" fill="#f7a12b" />
          <path d="M360 0h40v200h-57c23-66 26-132 17-200Z" fill="#ffffff" fillOpacity=".92" />
        </>
      )}
      {face === "clicks" && (
        <g fill="#ffffff" fillOpacity=".14">
          {Array.from({ length: 8 }, (_, col) =>
            Array.from({ length: 4 }, (_, row) => (
              <circle key={`${col}-${row}`} cx={226 + col * 24} cy={26 + row * 24} r="3.2" />
            )),
          )}
        </g>
      )}
    </svg>
  );
}
