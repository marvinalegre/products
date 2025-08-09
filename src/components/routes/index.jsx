import { useState } from "react";
import { useFetcher, useLoaderData, Link } from "react-router";
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
        <Link to="/addproduct">
          <Button className="my-10">Add a product</Button>
        </Link>
      )}
      <ProductTable products={products} />
    </>
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

export async function action() {
  console.log("hit");
  await fetch("/api/products", { method: "post" });
  return null;
}
