interface TableGeneratorProps {
  start: number;
  end: number;
  tableAmount: number;
  tableData: { [key: string]: any[] };
  setSelectedTable: (table: string) => void;
}

export default function TableGenerator({
  start,
  end,
  tableAmount,
  tableData,
  setSelectedTable,
}: TableGeneratorProps) {
  const generateTable = () => {
    const tables = [];
    for (let i = start; i <= end; i++) {
      switch (tableAmount) {
        case 1:
          tables.push(
            <button
              className="m-3 flex flex-col items-center"
              onClick={() => setSelectedTable(String(i))}
              key={i}
            >
              <p>{i}</p>
              <div>
                <div className="w-10 h-10 border flex items-center justify-center">
                  <p className="text-xl">{tableData[String(i)][1][0]}</p>
                </div>
                <div className="w-full h-4 border flex items-center justify-center">
                  <p className="text-xs text-center">{tableData[String(i)][0]}</p>
                </div>
              </div>
            </button>
          );
          break;
        case 2:
          tables.push(
            <button
              className="m-3 flex flex-col items-center"
              onClick={() => setSelectedTable(String(i))}
              key={i}
            >
              <p>{i}</p>
              <div>
                <div className="w-10 h-10 border flex items-center justify-center">
                  <p className="text-xl">{tableData[String(i)][1][0]}</p>
                </div>
                <div className="w-10 h-10 border flex items-center justify-center">
                  <p className="text-xl">{tableData[String(i)][1][1]}</p>
                </div>
                <div className="w-full h-4 border flex items-center justify-center">
                  <p className="text-xs text-center">{tableData[String(i)][0]}</p>
                </div>
              </div>
            </button>
          );
          break;
        case 4:
          tables.push(
            <button
              className="m-3 flex flex-col items-center"
              onClick={() => setSelectedTable(String(i))}
              key={i}
            >
              <p>{i}</p>
              <div>
                <div className="flex">
                  <div className="w-10 h-10 border flex items-center justify-center">
                    <p className="text-xl">{tableData[String(i)][1][0]}</p>
                  </div>
                  <div className="w-10 h-10 border flex items-center justify-center">
                    <p className="text-xl">{tableData[String(i)][1][1]}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 h-10 border flex items-center justify-center">
                    <p className="text-xl">{tableData[String(i)][1][2]}</p>
                  </div>
                  <div className="w-10 h-10 border flex items-center justify-center">
                    <p className="text-xl">{tableData[String(i)][1][3]}</p>
                  </div>
                </div>
                <div className="w-full h-4 border flex items-center justify-center">
                  <p className="text-xs text-center">{tableData[String(i)][0]}</p>
                </div>
              </div>
            </button>
          );
          break;
      }
    }
    return tables;
  };

  return <>{generateTable()}</>;
}
