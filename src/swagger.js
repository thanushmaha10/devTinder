const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevTinder API",
      version: "1.0.0",
      description: "API documentation for DevTinder backend",
    },
    servers: [
      {
        url: "http://localhost:7777",
        description: "Local server",
      },
      {
        url: "https://dev-tinder-seven-beta.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
