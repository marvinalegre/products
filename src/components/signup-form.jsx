import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link, useActionData, useNavigation } from "react-router";
import clsx from "clsx";

export function SignupForm({ className, ...props }) {
  const errors = useActionData();
  const navigation = useNavigation();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <Form method="post">
            <div className="grid gap-6">
              <div className="grid gap-6">
                {errors?._form && (
                  <p className="text-sm text-red-500 text-center">
                    {errors?._form}
                  </p>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    className={clsx(
                      errors?.username && "border-2 border-destructive",
                    )}
                    disabled={
                      navigation.state !== "idle" &&
                      navigation.location?.pathname === "/signup"
                    }
                  />
                  {errors?.username && (
                    <p className="text-sm text-red-500 -mt-1">
                      {errors?.username}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className={clsx(
                      errors?.password && "border-2 border-destructive",
                    )}
                    disabled={
                      navigation.state !== "idle" &&
                      navigation.location?.pathname === "/signup"
                    }
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-500 -mt-1">
                      {errors?.password}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full text-md font-semibold"
                  disabled={
                    navigation.state !== "idle" &&
                    navigation.location?.pathname === "/signup"
                  }
                >
                  {navigation.state !== "idle" &&
                  navigation.location?.pathname === "/signup"
                    ? "Signing Up..."
                    : "Sign Up"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
