import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "table-guide-simulator" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Form method="post" action="/play">
        <div className="flex flex-col w-full max-w-xs">
          <h1 className="my-5">1時間の営業を好きな時間に圧縮できます</h1>
          <span className="label-text mb-2">何分でやる？</span>
          <div className="flex items-center">
            <div className="flex-1">
              <input
                type="number"
                name="numericField"
                min="0"
                step="1"
                placeholder="2"
                className="input input-bordered w-full"
              />
            </div>
            <span className="ml-2">分</span>
          </div>
        </div>
        <button type="submit" className="btn my-4 w-full">Play</button>
      </Form>
    </div>
  );
}