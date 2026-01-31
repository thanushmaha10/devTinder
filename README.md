# DevTinder API

DevTinder API is a backend RESTful application built to support a developer matchmaking platform.  
It enables developers to register, create profiles, discover other developers, and manage connection requests securely.

This project focuses on backend architecture, authentication, and clean API design using modern JavaScript technologies.

---

## Useful Links

- Live API : [https://devtinder.shapy.in](https://devtinder.shapy.in/docs/)

## Features

- User authentication and authorization using JWT
- Secure login and registration
- Profile creation and update
- Send, accept, and reject connection requests
- RESTful API design
- Middleware-based request handling
- API documentation using Swagger

---

## Tech Stack

- **JavaScript**
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **Swagger (OpenAPI)**

---

## Screenshots

### Swagger API Documentation
<img width="1095" height="850" alt="image" src="https://github.com/user-attachments/assets/eb6b971a-5ec9-438b-b7bf-de4bb371f171" />


---

## Application Architecture

The application follows a layered architecture:

- **Routes** handle HTTP requests and define API endpoints  
- **Models** manage database schemas and data logic  
- **Middleware** controls authentication
- **Utils** contains reusable helper and validation functions  
- **Config** stores environment-specific configuration  

This separation improves scalability and maintainability.

---

## Validation & Security

The application includes utility-based validation to:
- Validate signup data
- Control which profile fields can be edited
- Restrict password updates to password-only requests

JWT is used for authentication, and sensitive data is managed using environment variables.

---

## API Documentation

Swagger is integrated to provide interactive API documentation.

Once the server is running, Swagger UI is available at:
/api/docs

This allows developers to explore and test the APIs easily.

---

## Deployment

The project is deployment-ready and includes:
- Docker configuration for containerized deployment

Environment variables must be configured on the deployment platform.

---

## Learning Outcomes

Through this project, the following backend concepts were practiced:
- REST API design
- Express application structuring
- Middleware usage
- Request validation
- MongoDB schema modeling
- API documentation with Swagger
- Production-ready project setup

---

## Author

**Thanush Maha**  

GitHub: https://github.com/thanushmaha10  
LinkedIn: https://www.linkedin.com/thanushm10

---

## 📄 License

This project is created for learning and demonstration purposes.
