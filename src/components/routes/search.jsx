import { useEffect, useState } from "react";
import {
  Form,
  Link,
  redirect,
  useSubmit,
  useLoaderData,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router";
import clsx from "clsx";
import validbarcode from "barcode-validator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, XIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function () {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [inputValue, setInputValue] = useState("");
  const { products, q } = useLoaderData();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <Dialog open={true}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[625px] fixed top-60 left-1/2 -translate-x-1/2"
        >
          <VisuallyHidden>
            <DialogTitle>Search products</DialogTitle>
          </VisuallyHidden>
          <XIcon onClick={() => navigate(-1)} />
          <Form
            className="grid gap-4"
            onChange={(e) => {
              const isFirstSearch = q === null;
              submit(e.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <div className="grid gap-3">
              <Input
                id="q"
                defaultValue={q || ""}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                placeholder="Search products..."
                name="q"
              />
            </div>
          </Form>

          <ScrollArea className="max-h-[50vh] rounded-md border p-4">
            {products.length > 0 ? (
              <ul className="list-none p-0">
                {products.map((product) => (
                  <li tabIndex="-1" key={product.public_id}>
                    <Link
                      tabIndex="0"
                      to={`/p/${product.public_id}`}
                      className="flex justify-between p-2 m-2"
                    >
                      <span>{product.product_name}</span>
                      <span>{product.price ? `₱${product.price}` : null}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : inputValue.length ? (
              <p className="text-center text-gray-500 p-6">No results found.</p>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const baseUrl = new URL(url.origin + "/api/search");
  baseUrl.searchParams.set("q", q);
  const res = await fetch(baseUrl);
  return { products: await res.json(), q };
}
