import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller";
import authMiddleware from "../middlewares/auth-middleware";

const router: Router = Router();

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               firstname:
 *                 type: string
 *                 description: User's first name
 *               lastname:
 *                 type: string
 *                 description: User's last name
 *     responses:
 *       200:
 *         description: Successful registration, returns access and refresh tokens and user information.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: |
 *               Sets the `refreshToken` cookie for user session management.
 *               - `HttpOnly`: true (cannot be accessed by client-side JavaScript)
 *               - `Path`: / (cookie valid for the entire domain)
 *               - `Max-Age`: 2592000 seconds (30 days)
 *               - `Expires`: Sunday, April 6, 2025 22:19:42 GMT (example expiration date)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token for accessing protected resources.
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for renewing the access token.
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID.
 *                     email:
 *                       type: string
 *                       description: User's email address.
 *                     firstname:
 *                       type: string
 *                       description: User's first name.
 *                     lastname:
 *                       type: string
 *                       description: User's last name.
 *       400:
 *         description: Registration error, for example, if the email already exists or the data is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Validation error details.
 */
router.post(
  "/register",
  body("email").isEmail(),
  body("email").isLength({ min: 3, max: 32 }),
  body("password").isLength({ min: 3, max: 32 }),
  body("firstname").notEmpty(),
  userController.registration,
);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User authentication and login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email for login.
 *               password:
 *                 type: string
 *                 description: User's password for login.
 *     responses:
 *       200:
 *         description: Successful login, returns access and refresh tokens and user information.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: |
 *               Sets the `refreshToken` cookie for user session management.
 *               - `HttpOnly`: true (cannot be accessed by client-side JavaScript)
 *               - `Path`: / (cookie valid for the entire domain)
 *               - `Max-Age`: 2592000 seconds (30 days)
 *               - `Expires`: Sunday, April 6, 2025 22:20:16 GMT (example expiration date)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token.
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token.
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID.
 *                     email:
 *                       type: string
 *                       description: User's email.
 *                     firstname:
 *                       type: string
 *                       description: User's first name.
 *                     lastname:
 *                       type: string
 *                       description: User's last name.
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authentication error message.
 *       400:
 *         description: Validation error in input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Validation error details.
 */
router.post("/login", userController.login);

/**
 * @openapi
 * /api/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # If Bearer token authorization is required
 *     responses:
 *       200:
 *         description: Successful user logout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Response status (200 - OK).
 *       401:
 *         description: Unauthorized, if authorization is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authorization error message.
 */
router.post("/logout", userController.logout);

/**
 * @openapi
 * /api/refresh:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # If Bearer token authorization is required
 *     responses:
 *       200:
 *         description: Successful token refresh, returns new access and refresh tokens.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: |
 *               Sets a new `refreshToken` cookie to maintain user session.
 *               - `HttpOnly`: true (cannot be accessed by client-side JavaScript)
 *               - `Path`: / (cookie valid for the entire domain)
 *               - `Max-Age`: 2592000 seconds (30 days)
 *               - `Expires`: Sunday, April 6, 2025 22:22:55 GMT (example expiration date)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token.
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token.
 *       401:
 *         description: Invalid or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post("/refresh", userController.refresh);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] # If Bearer token authorization is required
 *     responses:
 *       200:
 *         description: Successful request, returns an array of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: User ID.
 *                   email:
 *                     type: string
 *                     description: User's email.
 *                   firstname:
 *                     type: string
 *                     description: User's first name.
 *                   lastname:
 *                     type: string
 *                     description: User's last name.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Record creation date.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Last record update date.
 *       500:
 *         description: Server error while retrieving the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Error details.
 */
router.get("/users", authMiddleware, userController.getUsers);

export default router;
