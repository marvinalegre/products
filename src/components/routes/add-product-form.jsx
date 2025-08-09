import { Form, Link, useLoaderData, useNavigation } from "react-router";
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
  const navigation = useNavigation();
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-3">
          <DialogTitle>Create a product entry</DialogTitle>
        </DialogHeader>
        <Form className="grid gap-4" method="post">
          <div className="grid gap-3">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              name="name"
              required
              disabled={navigation.state !== "idle"}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              name="barcode"
              required
              disabled={navigation.state !== "idle"}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              disabled={navigation.state !== "idle"}
            />
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
