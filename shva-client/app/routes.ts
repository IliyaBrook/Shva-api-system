import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

// noinspection JSUnusedGlobalSymbols
export default [
  index("./pages/login.tsx"),
  route("/register", "./pages/register.tsx"),
  route("/users", "./pages/users.tsx"),
] satisfies RouteConfig;