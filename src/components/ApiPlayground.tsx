"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Endpoint = "phrases" | "funFact" | "scientist" | "command" | "shortcuts";

const endpoints: Record<
  Endpoint,
  { label: string; filters: { name: string; options?: string[] }[] }
> = {
  phrases: {
    label: "Phrases",
    filters: [
      { name: "category", options: ["ciencia", "literatura", "filosofía"] },
      { name: "author" },
      { name: "page", options: ["1", "2", "3"] },
      { name: "limit", options: ["5", "10", "20"] },
    ],
  },
  funFact: {
    label: "Fun Facts",
    filters: [
      { name: "category", options: ["Cultura", "Historia", "Ciencia"] },
      { name: "text" },
      { name: "page", options: ["1", "2", "3"] },
      { name: "limit", options: ["2", "5", "10"] },
    ],
  },
  scientist: {
    label: "Scientists",
    filters: [
      { name: "field", options: ["Informática", "Física", "Biología"] },
      { name: "name" },
      { name: "page", options: ["1", "2", "3"] },
      { name: "limit", options: ["5", "10", "20"] },
    ],
  },
  command: {
    label: "Commands",
    filters: [
      { name: "os", options: ["linux", "windows", "mac"] },
      { name: "page", options: ["1", "2", "3"] },
      { name: "limit", options: ["5", "10", "20"] },
    ],
  },
  shortcuts: {
    label: "Shortcuts",
    filters: [
      { name: "os", options: ["linux", "windows", "mac"] },
      { name: "page", options: ["1", "2", "3"] },
      { name: "limit", options: ["2", "5", "10"] },
    ],
  },
};

export default function Playground() {
  const [selected, setSelected] = useState<Endpoint>("phrases");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);

  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll("button");
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (!value) delete newFilters[key]; // 🔥 quita filtro vacío
      else newFilters[key] = value;
      return newFilters;
    });
  };

  const buildUrl = () => {
    const params = new URLSearchParams(filters).toString();
    return `/api/${selected}${params ? `?${params}` : ""}`;
  };

  const handleFetch = async () => {
    const url = buildUrl();
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponse({ url, data });
    } catch (err) {
      setResponse({ error: "Error al hacer la petición" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-6">
      {/* Título animado */}
      <h1 className="text-3xl font-bold text-center mb-6 animate-fade-scale">
        API Playground 🚀
      </h1>

      {/* Selector de endpoint con animación GSAP */}
      <div
        ref={buttonsRef}
        className="flex flex-wrap justify-center gap-3 mb-6"
      >
        {Object.entries(endpoints).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => {
              setSelected(key as Endpoint);
              setFilters({});
              setResponse(null);
            }}
            className={`btn ${
              selected === key ? "btn-primary" : "btn-outline btn-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* URL Preview */}
      <div className="bg-gray-900 text-green-400 font-mono text-sm p-3 rounded mb-4 animate-slide-left">
        {process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}
        {buildUrl()}
      </div>

      {/* Filtros dinámicos */}
      <div className="card bg-gray-800 shadow-xl p-6 max-w-2xl mx-auto animate-fade-up">
        <h2 className="text-xl font-semibold mb-4 text-gradient">
          Filtros para {endpoints[selected].label}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpoints[selected].filters.map((filter) =>
            filter.options ? (
              <select
                key={filter.name}
                value={filters[filter.name] || ""}
                onChange={(e) => handleChange(filter.name, e.target.value)}
                className="select select-bordered w-full bg-gray-900 text-white"
              >
                <option value="">{filter.name}</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={filter.name}
                type="text"
                placeholder={filter.name}
                value={filters[filter.name] || ""}
                onChange={(e) => handleChange(filter.name, e.target.value)}
                className="input input-bordered w-full bg-gray-900 text-white"
              />
            )
          )}
        </div>

        <button
          onClick={handleFetch}
          className="btn btn-primary mt-4 w-full animate-fade-scale"
        >
          Ejecutar petición
        </button>
      </div>

      {/* Respuesta */}
      {response && (
        <div className="mt-6 p-4 bg-black/60 rounded-lg animate-fade-up">
          <h3 className="font-semibold mb-2">📡 Respuesta:</h3>
          <pre className="text-xs md:text-sm whitespace-pre-wrap break-words bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto animate-fade-scale">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
