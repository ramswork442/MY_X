import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const LanguageSelector = ({ selectedLang, onChange, setTranscript }) => {
  const [open, setOpen] = useState(false);
  const languages = ["English", "Hindi"];

  return (
    <div className="relative w-full">
      <button
        className="w-full flex justify-between items-center px-4 py-2 rounded-md bg-gradient-to-br from-white/10 to-blue-600 text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedLang || "Language Selection"}
        <span
          className={`transition-transform duration-300 ease-in-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown size={24} />
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-black rounded-md shadow-lg overflow-hidden border border-gray-700">
          {languages.map((lang) => (
            <button
              key={lang}
              className="w-full px-4 py-2 text-left bg-white/10 text-gray-200 hover:bg-gray-500"
              onClick={() => {
                onChange(lang);
                setOpen(false);
                setTranscript("")
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
