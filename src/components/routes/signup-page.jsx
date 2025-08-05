import { Link } from "react-router";
import { SignupForm } from "@/components/signup-form";
import { PackageSearch } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-bold text-xl"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <PackageSearch className="size-4" />
          </div>
          products
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}

export async function action({ request }) {
  let formData = await request.formData();
  let username = formData.get("username");
  let password = formData.get("password");
  console.log(username, password);

  return null;
}
