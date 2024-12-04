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
          <h1 className="my-5">1時間の営業を好きな時間に圧縮できます
          </h1>
          <span className="label-text mb-2">何分でやる？</span>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="3"
              name="min"
              className="input input-bordered flex-grow"
              required
            />
            <p className="ml-2">分</p>
          </div>
        </div>
        <button type="submit" className="btn mt-4">Play</button>
      </Form>
    </div >
  );
}