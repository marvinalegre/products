import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductTable({ products }) {
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
              key={p.product_id}
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
                {p.last_edit
                  ? new Date(p.last_edit).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
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
            key={p.product_id}
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
              {p.last_edit
                ? new Date(p.last_edit).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
