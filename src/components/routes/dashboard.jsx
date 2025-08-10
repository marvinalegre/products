import UsersChart from "@/components/users-chart";
import ProductsChart from "@/components/products-chart";

export default function () {
  return (
    <div className="p-4 gap-10 md:flex md:items-center md:justify-center">
      <ProductsChart />
      <UsersChart />
    </div>
  );
}

export async function loader() {
  const res = await fetch("/api/dashboard");
  return await res.json();
}
