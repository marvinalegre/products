import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ({ products }) {
  return (
    <Table className="w-1/3">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Product Name</TableHead>
          <TableHead>Barcode</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.productId}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.barcode}</TableCell>
            <TableCell className="text-right">
              {p.price ? `PHP ${p.price}` : p.price}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
