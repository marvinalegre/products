import { AppSidebar } from "@/components/app-sidebar";
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
import { Outlet, Link, useLoaderData, useNavigation } from "react-router";

export default function Root() {
  const { username } = useLoaderData();
  const navigation = useNavigation();

  return (
    <SidebarProvider>
      <AppSidebar username={username} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-between w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
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
