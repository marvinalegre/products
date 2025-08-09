import { useState } from "react";
import { useFetcher, useLoaderData, Link } from "react-router";
import { Button } from "@/components/ui/button";
import ProductTable from "@/components/product-table.jsx";

export default function Index() {
  const { username, products } = useLoaderData();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);

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
  const res2 = await fetch("/api/products");
  const products = await res2.json();
  if (res.status === 200) {
    const { username } = await res.json();
    return { username, products };
  }
  return { username: null, products };
}
