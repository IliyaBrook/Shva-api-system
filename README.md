# Shva-api-system

## Project Description

Shva-api-system is an API system designed for user authentication and management. The project consists of a server-side (API) component and, presumably, a client-side component (although your description primarily focuses on the server and its documentation). The server-side is developed using Node.js, Express, TypeScript, and Sequelize ORM for interacting with an SQLite database. API documentation is generated using Swagger and is accessible via Swagger UI.

## Installation and running in dev mode

1.  **Clone the repository:**
    
    ```bash
    git clone https://github.com/IliyaBrook/autoApplylinkedin.git
    cd Shva-api-system
    ```

2.  **Install dependencies:**
    
    In the root directory of the project, execute the command to install all necessary dependencies for both the server and the client:
    
    ```bash
    yarn install
    ```

3.  **Run the project:**
    
    To start the server and client, run the command:
    
    ```bash
    yarn start
    ```
    
    This command will launch the server application on the port specified in the `.env` file (or port 5000 by default if the `PORT` environment variable is not set), client side launch on port 3000.

## Installation and running in production mode

1. **Build for Production:**    Before running in production, you need to build both the client and server applications. Execute the following command in the root directory:   

   ```sh
   yarn build
   ```

    This command compiles the TypeScript server code and builds the client-side React application into static files. 

2. **Run the project in production mode:**    To start the server in production mode, which will also serve the static client files, run the command:

   ```sh
   yarn start:prod
   ```

   This command launches the server application in production environment. By default, the application will be running on 

   **port 80**

## API Server Testing

Several methods are available for testing the API server:

1.  **Using HTTP Requests via `api-requests.http`:**
    
    In the `shva-server/httpTestRequests/` directory, you will find the `api-requests.http` file, which contains examples of HTTP requests for various API endpoints. You can use VS Code extensions such as "REST Client" or "Thunder Client" to send these requests directly from the code editor and view the server responses.

2.  **Swagger UI Documentation:**
    
    After starting the server, the interactive API documentation in Swagger UI format will be accessible at:
    
    [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
    
    
    
    By navigating to this link in your browser, you will be able to:
	
	*   Visually explore all available API endpoints, their methods, parameters, request bodies, and response schemas.
	*   Use the interactive Swagger UI interface to send requests to the API directly from your browser and view server responses, including status codes, headers, and response bodies.
	*   Test various scenarios and explore the capabilities of your API.

## Authorization Logic

The core authorization logic in the system is built upon the use of JWT (JSON Web Tokens) and refresh tokens to ensure security and user session convenience:

1.  **Token Issuance upon Registration and Login:**
    Upon successful user registration (`/api/register`) or login to an existing account (`/api/login`), the server issues two types of tokens:
	*   **`accessToken`**:  An access token used to authenticate the user when requesting protected API resources. The `accessToken` has a limited lifespan of **30 minutes**.
	*   **`refreshToken`**: A refresh token used to obtain new pairs of `accessToken` and `refreshToken` after the `accessToken` expires. The `refreshToken` has a longer lifespan of **30 days**. The `refreshToken` is transmitted to the client in an `httpOnly` cookie for enhanced security.

2.  **Token Refresh (Refresh Token):**
    When the `accessToken` expires, the client can use the `refreshToken` to request a new pair of tokens. To do this, the client must send a request to the `/api/refresh` endpoint. The server performs the following actions upon a token refresh request:
	*   **`refreshToken` Validity Check**: The server extracts the `refreshToken` from the `httpOnly` cookie provided by the client and checks its validity, including verifying the JWT signature and its presence in the database (to prevent token revocation).
	*   **Issuance of a New Token Pair**: If the `refreshToken` is valid, the server generates a new pair of `accessToken` and `refreshToken`, saves the new `refreshToken` to the database (updating the old one), and sends the new `accessToken` in the response body and the new `refreshToken` in an `httpOnly` cookie.

This mechanism provides a balance between security (short lifespan of `accessToken`) and ease of use (extended session duration using `refreshToken` and the refresh token mechanism).

## Database and Environment Variables

* **Database:** The project uses an **SQLite** database. The `database.sqlite` file is located in the `shva-server/src/database/` directory.

* **.env Files:** For convenience and ease of project verification, all `.env` files containing environment variables have been saved and are included in the repository (and were not excluded from version control), 

  This was done for the convenience of checking the project.

## Additional Commands

*   **`yarn lint`**: Runs linting across the entire project, both client and server.
*   **`yarn format`**: Runs Prettier to format code across the entire project, both client and server.
