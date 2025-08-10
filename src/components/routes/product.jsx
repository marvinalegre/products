import { redirect, useLoaderData, useParams, Link } from "react-router";
import { MoveLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function () {
  const { publicId } = useParams();
  const { product, history } = useLoaderData();

  return (
    <div className="space-y-6 p-4">
      <Link to={`/`} className="block">
        <Button size="lg" variant="ghost">
          <MoveLeft />
        </Button>
      </Link>
      <Link to={`/p/${publicId}/edit`}>
        <Button>Edit</Button>
      </Link>
      {/* Current product info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{product.product_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Barcode:</strong> {product.barcode || "—"}
          </p>
          <p>
            <strong>Price:</strong>{" "}
            {product.price ? `PHP ${product.price}` : "—"}
          </p>
          <p>
            <strong>Last Updated:</strong>
            {product.created_at
              ? convertUTCToPHT(new Date(product.created_at)).toLocaleString()
              : "—"}
          </p>
        </CardContent>
      </Card>

      {/* Version history */}
      <div>
        <h2 className="text-xl font-semibold mb-2">History</h2>

        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((v) => (
                <TableRow key={v.version_id}>
                  <TableCell>{v.product_name}</TableCell>
                  <TableCell>{v.barcode || "—"}</TableCell>
                  <TableCell>{v.price ? `PHP ${v.price}` : "—"}</TableCell>
                  <TableCell>{v.username || "Unknown"}</TableCell>
                  <TableCell>
                    {convertUTCToPHT(new Date(v.created_at)).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="space-y-3 md:hidden">
          {history.map((v) => (
            <Card key={v.version_id} className="p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(v.created_at).toLocaleString()}
                </span>
              </div>
              <p className="font-medium">{v.product_name}</p>
              <p className="text-sm text-muted-foreground">
                Barcode: {v.barcode || "—"}
              </p>
              <p className="text-sm">
                Price: {v.price ? `PHP ${v.price}` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                By: {v.username || "Unknown"}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const { publicId } = params;

  const res = await fetch(`/api/products/${publicId}`);

  if (res.status !== 200) return redirect("/");

  return await res.json();
}

function convertUTCToPHT(date) {
  // Ensure the input is a Date object
  if (!(date instanceof Date)) {
    throw new Error("Input must be a Date object");
  }

  // Philippine time zone offset in minutes (+8 hours * 60)
  const PHT_OFFSET = 8 * 60;

  // Get the time in milliseconds since epoch (UTC)
  const utcTime = date.getTime();

  // Calculate offset in milliseconds
  const offsetMillis = PHT_OFFSET * 60 * 1000;

  // Create new date adjusted for PHT
  const phtDate = new Date(utcTime + offsetMillis);

  return phtDate;
}
