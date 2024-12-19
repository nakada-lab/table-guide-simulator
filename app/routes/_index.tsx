import type { MetaFunction } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "table-guide-simulator" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const convertToHalfWidth = (value: string) => {
    return value.replace(/[０-９]/g, s =>
      String.fromCharCode(s.charCodeAt(0) - 65248)
    ).replace(/\D/g, '');
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Form method="post" action="/play">
        <div className="flex flex-col w-full max-w-xs">
          <div className="my-5">
            <p className=''>名前を入力</p>
            <input className="input input-bordered  w-full"
              type='text'
              name='name'
              placeholder="空白可" />
          </div>
          <div className="my-5">
            <p className=''>飲食歴を年数で (未経験は0 四捨五入して)</p>
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  name="year"
                  min="0"
                  step="1"
                  placeholder="整数値"
                  required
                  className="input input-bordered w-full"
                  onInput={(e) => {
                    e.currentTarget.value = convertToHalfWidth(e.currentTarget.value);
                  }}
                />
              </div>
              <span className="ml-2">年</span>
            </div>
          </div>
          <div className="my-5">
            <p className="">1時間の営業を好きな時間に圧縮できます</p>
            <span className="label-text mb-2">何分でやる？</span>
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="number"
                  name="min"
                  min="1"
                  step="1"
                  placeholder="2"
                  className="input input-bordered w-full"
                  required
                  onInput={(e) => {
                    e.currentTarget.value = convertToHalfWidth(e.currentTarget.value);
                  }}
                />
              </div>
              <span className="ml-2">分</span>
            </div>
          </div>
        </div>
        <button type="submit" className="btn my-4 w-full">Play</button>
        <button
          className="btn w-full"
          onClick={() => { navigate('/score'); }}
        >
          Score
        </button>
      </Form>
    </div>
  );
}