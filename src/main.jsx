import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PackageSearch } from "lucide-react";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import Root from "@/components/routes/root";
import SignupPage, {
  action as signupAction,
  loader as signupLoader,
} from "@/components/routes/signup-page";
import LoginPage, {
  action as loginAction,
  loader as loginLoader,
} from "@/components/routes/login-page";
import Index, { action as indexAction } from "@/components/routes/index";
import { action as logoutAction } from "@/components/routes/logout";
import UsersChart from "@/components/users-chart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const { username } = await res.json();
        return { username };
      }
      return { username: null };
    },
    children: [
      {
        index: true,
        element: <Index />,
        action: indexAction,
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
        path: "dashboard",
        element: (
          <div className="md:flex md:items-center md:justify-center">
            <UsersChart />
          </div>
        ),
        loader: async () => {
          const res = await fetch("/api/dashboard");
          return await res.json();
        },
      },
      {
        path: "settings",
        element: <h1>settings</h1>,
      },
    ],
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
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
