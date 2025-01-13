import path from "path";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TAPI-SWAGGERUI",
      description: "REST API do zarządzania produktami, dostawcami i kategoriami.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8989",
        description: "Development Server",
      },
    ],
    components: {
      schemas: {}, // Załadujemy je później
    },
  },
  apis: [path.resolve("./routes/**/*.js")], // Przeszukuje pliki endpointów w katalogu `routes`
};