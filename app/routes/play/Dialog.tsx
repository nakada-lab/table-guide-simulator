interface DialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>;
  queue: string[][];
  selectedQueue: string;
  divider: (index: number) => void;
  value: number;
  setValue: (value: number | ((prev: number) => number)) => void;
  setPlayPause: (value: boolean) => void;
}

export default function Dialog({
  dialogRef,
  queue,
  selectedQueue,
  divider,
  value,
  setValue,
  setPlayPause
}: DialogProps) {
  const queueIndex = queue.findIndex(([uuid]) => uuid === selectedQueue);
  const maxLength = queue[queueIndex]?.[1]?.length ?? 0;

  const handleIncrease = () => {
    setValue(prev => Math.min(maxLength, prev + 1));
  };

  const handleDecrease = () => {
    setValue(prev => Math.max(1, prev - 1));
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setPlayPause(true);
    }
  };

  return (
    <dialog ref={dialogRef} id="my_modal_1" className="modal">
      <div className="modal-box">
        <p className="">{maxLength}人をどう分ける？</p>
        <div className="modal-action">
          <div className="w-full flex items-center justify-center flex-col">
            <div className="w-full flex items-center pb-10 justify-center">
              <button
                type="button"
                onClick={handleDecrease}
                className="px-3 py-1 border rounded-l"
                disabled={value <= 0}
              >
                -
              </button>
              <input
                type="number"
                value={value}
                readOnly
                min="1"
                max={maxLength - 1}
                className="w-16 text-center border-y"
              />
              <button
                type="button"
                onClick={handleIncrease}
                className="px-3 py-1 border rounded-r"
                disabled={value >= maxLength - 1}
              >
                +
              </button>
              <p className="ml-5">と</p>
              <p className="ml-5">{maxLength - value}人</p>
            </div>
            <form method="dialog" className="w-full flex items-center justify-center">
              <button
                className="btn bg-neutral"
                onClick={() => {
                  closeDialog()
                  setValue(1)
                }}
              >
                閉じる
              </button>
              <div className="flex-1"></div>
              <button
                className="btn bg-primary"
                onClick={() => divider(queueIndex)}
              >
                分ける
              </button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
