import { useQuery } from "@tanstack/react-query";
import { columns, type Payment } from "@/components/tables/column";
import { DataTable } from "@/components/tables/data-tables";
import { nanoid } from "nanoid";

function getData(): Promise<Payment[]> {
  return Promise.resolve([
    { id: nanoid(), amount: 189, status: "pending", email: "me2@expamle.com" },
    {
      id: nanoid(),
      amount: 984,
      status: "processing",
      email: "me2@expamle.com",
    },
    {
      id: nanoid(),
      amount: 9849,
      status: "success",
      email: "am32@expamle.com",
    },
    { id: nanoid(), amount: 2819, status: "pending", email: "22@expamle.com" },
    { id: nanoid(), amount: 847, status: "failed", email: "wdme4@expamle.com" },
    {
      id: nanoid(),
      amount: 152,
      status: "processing",
      email: "mdxx2@expamle.com",
    },
  ]);
}

export default function Profile() {
  const { data = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: getData,
  });

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      <div>
        <input type="file" accept=".xlsx, .xls" />
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
