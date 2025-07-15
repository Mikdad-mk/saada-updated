"use client";

import Image from "next/image";

const images = [
  "/about.png",
  "/adheeb.png",
  "/shafin.png",
  "/anshid 1st.png",
  "/anshid d2.png",
  "/anshif.png",
  "/faseeh.png",
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800">Gallery</h1>
        <p className="text-gray-600 text-base sm:text-lg">A collection of memorable moments and highlights from SA'ADA Students' Union.</p>
      </div>
      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 max-w-5xl mx-auto">
        {images.map((src, idx) => (
          <div key={idx} className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-md bg-gray-100">
            <Image
              src={src}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={idx < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 