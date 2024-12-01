import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "table-guide-simulator" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link to="/play" className="btn">Play</Link>
    </div >
  );
}