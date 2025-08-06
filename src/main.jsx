import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PackageSearch } from "lucide-react";
import "./index.css";
import App from "./App.jsx";
import SignupPage, {
  action as signupAction,
  loader as signupLoader,
} from "@/components/routes/signup-page";
import LoginPage, {
  action as loginAction,
  loader as loginLoader,
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
    HydrateFallback,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    action: signupAction,
    loader: signupLoader,
    HydrateFallback,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
    loader: loginLoader,
    HydrateFallback,
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

function HydrateFallback() {
  return (
    <div className="h-screen relative">
      <div className="absolute left-1/2 top-2/5 -translate-x-1/2 flex items-center gap-2 self-center font-bold text-3xl">
        <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-md">
          <PackageSearch className="size-8" />
        </div>
        products
      </div>
    </div>
  );
}
