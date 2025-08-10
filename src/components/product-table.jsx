import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductTable({ products }) {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border shadow-sm">
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Product Name</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Last Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p, idx) => (
            <TableRow
              onClick={() => navigate(`/p/${p.public_id}`)}
              key={p.public_id}
              className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}
            >
              <TableCell className="font-medium">{p.product_name}</TableCell>
              <TableCell className="text-muted-foreground">
                {p.barcode || "—"}
              </TableCell>
              <TableCell>
                {p.price
                  ? p.price.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })
                  : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {p.created_at
                  ? convertUTCToPHT(new Date(p.created_at)).toLocaleDateString(
                      "en-PH",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile card layout */}
      <div className="space-y-4 md:hidden">
        {products.map((p, idx) => (
          <div
            key={p.public_id}
            onClick={() => navigate(`/p/${p.public_id}`)}
            className="rounded-lg border border-border p-4 bg-background"
          >
            <div className="font-medium">{p.product_name}</div>
            <div className="text-sm text-muted-foreground">
              Barcode: {p.barcode || "—"}
            </div>
            <div className="text-sm">
              Price:{" "}
              {p.price
                ? p.price.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })
                : "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              Last Edit:{" "}
              {p.created_at
                ? convertUTCToPHT(new Date(p.created_at)).toLocaleDateString(
                    "en-PH",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )
                : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
