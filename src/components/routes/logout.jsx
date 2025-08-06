import { redirect } from "react-router";

export async function action() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
  return redirect("/signup");
}
