import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Root, { loader as rootLoader } from "@/components/routes/root";
import SignupPage, {
  action as signupAction,
  loader as signupLoader,
} from "@/components/routes/signup-page";
import LoginPage, {
  loader as loginLoader,
  action as loginAction,
} from "@/components/routes/login-page";
import Index, { loader as indexLoader } from "@/components/routes/index";
import { action as logoutAction } from "@/components/routes/logout";
import EditProductForm, {
  loader as editProductLoader,
  action as editProductAction,
} from "@/components/routes/edit-product-form";
import AddProductForm, {
  loader as addProductLoader,
  action as addProductAction,
} from "@/components/routes/add-product-form";
import Product, { loader as productLoader } from "@/components/routes/product";
import Dashboard, {
  loader as dashboardLoader,
} from "@/components/routes/dashboard";
import Search, { loader as searchLoader } from "@/components/routes/search";

import { Box } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "addproduct",
        element: <AddProductForm />,
        loader: addProductLoader,
        action: addProductAction,
      },
      {
        path: "search",
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: "p/:publicId/edit",
        element: <EditProductForm />,
        loader: editProductLoader,
        action: editProductAction,
      },
      {
        path: "p/:publicId",
        element: <Product />,
        loader: productLoader,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
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
    loader: signupLoader,
    action: signupAction,
    HydrateFallback,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
    action: loginAction,
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
          <Box className="size-8" />
        </div>
        products
      </div>
    </div>
  );
}
