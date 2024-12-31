import type { MetaFunction } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { FiXCircle } from "react-icons/fi";

export const meta: MetaFunction = () => {
  return [
    { title: "table-guide-simulator" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  const [manualCounter, setManualCounter] = useState(1);
  const [isManualDialogOpen, setManualIsDialogOpen] = useState(false);
  const manual = [
    "上に待ち列が表示される",
    "名前の右下にグループの人数がでる",
    "グループのを入れたいテーブルに案内",
    "テーブルの下に小さく滞在時間が出る"
  ]

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
          <div className="my-3">
            <p className=''>名前を入力</p>
            <input className="input input-bordered  w-full"
              type='text'
              name='name'
              placeholder="空白可" />
          </div>
          <div className="my-3">
            <p className=''>飲食店の従業員歴</p>
            <p className='text-xs my-1'>四捨五入して整数値でお願いします</p>
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  name="year"
                  min="0"
                  step="1"
                  placeholder="未経験は0"
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
          {/* <div className="my-5">
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
          </div> */}
        </div>
        <button type="submit" className="btn my-2 w-full" onClick={() => {
          setManualIsDialogOpen(true)
          event.preventDefault();
        }}>
          操作説明を開く
        </button>
        <button type="submit" className="btn my-2 w-full">Play</button>
        <button
          className="btn my-2 w-full"
          onClick={() => { navigate('/score'); }}
        >
          Score
        </button>
      </Form>
      {isManualDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="h-5/6 w-5/6 flex items-center justify-center flex-col bg-white p-10 relative">
            <p className="text-2xl m-5">操作説明</p>
            <img
              src={`/table-guide-simulator/manual/${String(manualCounter)}.PNG`}
              alt={String(manualCounter)}
              className="border border-black p-1"
            />
            <div className="flex items-center justify-center flex-col">
              <p className="m-1">{manual[manualCounter - 1]}</p>
              <div className="flex items-center justify-center">
                <button
                  className="btn w-20 m-5"
                  onClick={() => setManualCounter(manualCounter - 1)}
                  disabled={manualCounter <= 1}
                >
                  まえ
                </button>
                <button
                  className="btn w-20 m-5"
                  onClick={() => setManualCounter(manualCounter + 1)}
                  disabled={manualCounter >= 4}
                >
                  つぎ
                </button>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 font-bold text-gray-700 text-3xl "
              onClick={() => {
                setManualIsDialogOpen(false)
                setManualCounter(1)
              }}
            >
              <FiXCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}