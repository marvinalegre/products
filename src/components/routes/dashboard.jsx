import UsersChart from "@/components/users-chart";

export default function () {
  return (
    <div className="md:flex md:items-center md:justify-center">
      <UsersChart />
    </div>
  );
}

export async function loader() {
  const res = await fetch("/api/dashboard");
  return await res.json();
}
