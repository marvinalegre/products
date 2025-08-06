import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import SignupPage, {
  action as signupAction,
} from "@/components/routes/signup-page";
import LoginPage, {
  action as loginAction,
} from "@/components/routes/login-page";
import { action as logoutAction } from "@/components/routes/logout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const { username } = await res.json();
        return { username };
      }
      return { username: null };
    },
  },
  {
    path: "/signup",
    element: <SignupPage />,
    action: signupAction,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
  },
  {
    path: "/logout",
    action: logoutAction,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
