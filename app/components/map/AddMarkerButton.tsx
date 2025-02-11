"use client";

export default function AddMarkerButton({ isAdding, toggleMarker }) {
  return (
    <button
      onClick={toggleMarker}
      className={`absolute top-8 right-6 z-10 bg-blue-500 text-white text-4xl rounded-full w-12 h-12 flex justify-center shadow-lg hover:bg-blue-700 transition-transform duration-300 ease-in-out ${
        isAdding ? "rotate-45" : ""
      }`}
    >
      +
    </button>
  );
}
