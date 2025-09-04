"use client";

import { useEffect, useRef } from "react";
import SwaggerUI from "swagger-ui-dist/swagger-ui-bundle";
import "swagger-ui-dist/swagger-ui.css";

export default function ApiDocsPage() {
  const swaggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swaggerRef.current) {
      SwaggerUI({
        domNode: swaggerRef.current,
        url: "/api/openapi", // tu endpoint OpenAPI (JSON o YAML)
      });
    }
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">API Docs</h1>
      <div ref={swaggerRef} />
    </main>
  );
}
