import type { MetaFunction } from "@remix-run/node";
import Header from "~/components/header";

export const meta: MetaFunction = () => {
  return [
    { title: "table-guide-simulator" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <Header />
      <hr className="border-2 border-primary my-4 w-full" />
      <div className="w-full flex-1"></div>
    </div>
  );
}