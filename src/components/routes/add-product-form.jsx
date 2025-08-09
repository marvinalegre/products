import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useActionData,
  useNavigation,
} from "react-router";
import clsx from "clsx";
import validbarcode from "barcode-validator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";

export default function () {
  const errors = useActionData();
  const navigation = useNavigation();

  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <DialogHeader className="mb-3">
          <DialogTitle>Create a product entry</DialogTitle>
        </DialogHeader>
        {errors?._form && (
          <p className="text-sm text-red-500 text-center">{errors?._form}</p>
        )}
        <Form className="grid gap-4" method="post">
          <div className="grid gap-3">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              name="name"
              disabled={navigation.state !== "idle"}
              className={clsx(errors?.name && "border-2 border-destructive")}
            />
            {errors?.name && (
              <p className="text-sm text-red-500 -mt-1">{errors?.name}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              name="barcode"
              disabled={navigation.state !== "idle"}
              className={clsx(errors?.barcode && "border-2 border-red-500")}
            />
            {errors?.barcode && (
              <p className="text-sm text-red-500 -mt-1">{errors?.barcode}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              disabled={navigation.state !== "idle"}
              className={clsx(errors?.price && "border-2 border-destructive")}
            />
            {errors?.price && (
              <p className="text-sm text-red-500 -mt-1">{errors?.price}</p>
            )}
          </div>
          <DialogFooter>
            <Link to="/">
              <Button variant="outline" disabled={navigation.state !== "idle"}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={navigation.state !== "idle"}>
              {navigation.state !== "idle" ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Add product"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export async function loader() {
  const res = await fetch("/api/auth/me");
  if (res.status !== 200) {
    return redirect("/login");
  }
  return null;
}

export async function action({ request }) {
  const { name, barcode, price } = Object.fromEntries(await request.formData());

  if (name === "") {
    return { name: "Please fill out this field" };
  }
  if (name.length > 150) {
    return { name: "The produt name must contain at most 150 character(s)" };
  }
  if (barcode && !validbarcode(barcode)) {
    return { barcode: "Invalid barcode" };
  }

  const res = await fetch("/api/products", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, barcode, price }),
  });
  if (res.status === 201) {
    return redirect("/");
  }
  return { _form: "Something went wrong." };
}
