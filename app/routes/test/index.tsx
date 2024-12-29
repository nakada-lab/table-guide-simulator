import { useState } from "react";
import { FiXCircle } from "react-icons/fi";

export default function Test() {
  const [manualCounter, setManualCounter] = useState(1);
  const [isManualDialogOpen, setManualIsDialogOpen] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center flex-col bg-black">
      <button
        className="btn w-40 m-5"
        onClick={() => setManualIsDialogOpen(true)}
      >
        操作説明を開く
      </button>
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
              onClick={() => setManualIsDialogOpen(false)}
            >
              <FiXCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
