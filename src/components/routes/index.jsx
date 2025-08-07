import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductTable from "@/components/product-table.jsx";
import { Loader2Icon } from "lucide-react";

export default function Index() {
  const { username } = useLoaderData();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const products = [
    {
      productId: 1,
      name: "Argentina Corned Beef 175g",
      barcode: "0748485800011",
      price: null,
    },
    {
      productId: 2,
      name: "Ideal Australia Harvest Whole Rolled Oats 500g",
      barcode: "4800030005466",
      price: null,
    },
  ];

  return (
    <>
      {username && (
        <Dialog open={open} onOpenChange={setOpen}>
          <form>
            <DialogTrigger asChild>
              <Button className="my-10">Add a product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="mb-3">
                <DialogTitle>Create a product entry</DialogTitle>
              </DialogHeader>
              <fetcher.Form className="grid gap-4" method="post">
                <div className="grid gap-3">
                  <Label htmlFor="name">Product name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    disabled={fetcher.state !== "idle"}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    required
                    disabled={fetcher.state !== "idle"}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    disabled={fetcher.state !== "idle"}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={fetcher.state !== "idle"}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={fetcher.state !== "idle"}>
                    {fetcher.state !== "idle" ? (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Add product"
                    )}
                  </Button>
                </DialogFooter>
              </fetcher.Form>
            </DialogContent>
          </form>
        </Dialog>
      )}
      <ProductTable products={products} />
    </>
  );
}

export async function action() {
  console.log("hit");
  await fetch("/api/products", { method: "post" });
  return null;
}
