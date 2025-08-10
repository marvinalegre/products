import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle.jsx";
import {
  Outlet,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { Search } from "lucide-react";

export default function Root() {
  const { username } = useLoaderData();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navigate("/search");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar username={username} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-between w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Link to="/search">
              <Button variant="outline">
                <Search />
                Search
                <Badge variant="outline">Ctrl K</Badge>
              </Button>
            </Link>
            <div className="flex gap-4 items-center">
              {username == null && (
                <Link to="/login" className="text-sm">
                  <Button>Log in</Button>
                </Link>
              )}
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div
            className={
              navigation.state !== "idle"
                ? "opacity-25 transition-opacity duration-200 delay-200"
                : ""
            }
          >
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function loader() {
  const res = await fetch("/api/auth/me");
  if (res.status === 200) {
    const { username } = await res.json();
    return { username };
  }
  return { username: null };
}
