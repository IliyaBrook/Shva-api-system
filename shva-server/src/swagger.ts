import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "shiva-api-system API DOCS",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token for API access.",
        },
      },
    },
  },
  apis: ["./src/router/index.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
