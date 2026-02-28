// components/ImageGallery.tsx
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;
  const count = images.length;

  return (
    <div>
      {/* Layouts */}
      {count === 1 && (
        <img
          src={images[0]}
          alt="Gallery"
          className="w-full h-auto object-cover rounded-xl cursor-pointer"
          onClick={() => setSelectedIndex(0)}
        />
      )}

      {count === 2 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Gallery ${i}`}
              className="w-full h-48 object-cover rounded-xl cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="grid grid-cols-2 gap-2">
          <img
            src={images[0]}
            alt="Gallery 0"
            className="h-64 w-full object-cover rounded-xl cursor-pointer"
            onClick={() => setSelectedIndex(0)}
          />
          <div className="flex flex-col gap-2">
            {images.slice(1).map((url, i) => (
              <img
                key={i + 1}
                src={url}
                alt={`Gallery ${i + 1}`}
                className="h-32 w-full object-cover rounded-xl cursor-pointer"
                onClick={() => setSelectedIndex(i + 1)}
              />
            ))}
          </div>
        </div>
      )}

      {count >= 4 && (
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Gallery ${i}`}
              className="h-32 w-full object-cover rounded-xl cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
          <div
            className="relative h-32 w-full rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedIndex(3)}
          >
            <img
              src={images[3]}
              alt="Gallery 3"
              className="h-full w-full object-cover"
            />
            {count > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold">
                +{count - 5}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Image */}
          <img
            src={images[selectedIndex]}
            alt={`Selected ${selectedIndex}`}
            className="max-h-[90%] max-w-[90%] rounded-xl"
          />

          {/* Prev button */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-4 text-white text-3xl font-bold px-2 py-1 bg-black/40 rounded-full hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white text-3xl font-bold px-2 py-1 bg-black/40 rounded-full hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
