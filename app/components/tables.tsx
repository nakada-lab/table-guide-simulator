export default function Tables() {
  const createTable = (start: number, end: number, has2ndDiv: boolean) => {
    return Array.from({ length: end - start + 1 }, (_, index) => (
      <div key={index} className="w-10 m-5 flex flex-col">
        <p>{start + index}</p>
        <div className="w-full h-10 border flex items-center justify-center">
          <p className="text-xl"></p>
        </div>
        {has2ndDiv && (
          <div className="w-full h-10 border flex items-center justify-center">
            <p className="text-xl"></p>
          </div>
        )}
        <div className="w-full h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="flex items-center">
        {createTable(1, 5, true)}
      </div>
      <div className="flex items-center">
        {createTable(6, 10, true)}
      </div>
      <div className="flex items-center">
        {createTable(11, 15, false)}
      </div>
    </div>
  );
}