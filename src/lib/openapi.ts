export const openapi = {
  openapi: "3.0.0",
  info: {
    title: "API Explorador de Frases Célebres",
    version: "1.0.0",
    description:
      "API para explorar frases célebres con filtros por autor y categoría",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [{ name: "Phrases", description: "Gestión y búsqueda de frases" }],
  paths: {
    "/api/phrases": {
      get: {
        tags: ["Phrases"],
        summary: "Listar frases",
        description:
          "Obtiene frases opcionalmente filtradas por autor y categoría.",
        parameters: [
          { name: "author", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de frases",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PhraseOut" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Phrases"],
        summary: "Crear una frase",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PhraseInput" },
              examples: {
                ejemplo: {
                  value: {
                    text: "La imaginación es más importante que el conocimiento.",
                    authorId: 1,
                    categoryId: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Frase creada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Phrase" },
              },
            },
          },
          "400": {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Author: {
        type: "object",
        properties: { id: { type: "integer" }, name: { type: "string" } },
      },
      Category: {
        type: "object",
        properties: { id: { type: "integer" }, name: { type: "string" } },
      },
      Phrase: {
        type: "object",
        properties: {
          id: { type: "integer" },
          text: { type: "string" },
          authorId: { type: "integer" },
          categoryId: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PhraseOut: {
        type: "object",
        description: "Respuesta expandida con autor y categoría",
        properties: {
          id: { type: "integer" },
          text: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          author: { $ref: "#/components/schemas/Author" },
          category: { $ref: "#/components/schemas/Category" },
        },
      },
      PhraseInput: {
        type: "object",
        properties: {
          text: { type: "string" },
          authorId: { type: "integer" },
          categoryId: { type: "integer" },
        },
        required: ["text", "authorId", "categoryId"],
      },
      ErrorResponse: {
        type: "object",
        properties: { error: { type: "string" }, message: { type: "string" } },
      },
    },
  },
} as const;
