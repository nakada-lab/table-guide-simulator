export default function Queue({ queue }: { queue: any[] }) {
  const queueLine = queue.map((item, index) => (
    <button key={index} className="relative" onClick={() => onClickHandle()}>
      <p className="text-3xl m-1">{item[0]}</p>
      <p className="text-xs absolute bottom-0 right-0">{item.length}</p>
    </button>
  ))

  const onClickHandle = () => {
    return
  }
  return (
    <div className="w-full max-h-full flex flex-wrap overflow-y-auto">
      {queueLine}
    </div>
  );
}