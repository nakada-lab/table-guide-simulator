import { useState, useEffect } from "react";
import Header from "~/components/header";
import { getEmoji } from "~/utils/myFunction";
import data from 'app/models/data.json';
import { ClientActionFunctionArgs, useActionData } from "@remix-run/react";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const min = formData.get("min");

  if (!min) {
    return { error: "時間を入力してください" };
  }

  return min;
}

export default function Index() {
  const [clock, setClock] = useState(getRandomTimeInRange());
  const [playPause, setPlayPause] = useState(true);
  const [queue, setQueue] = useState<string[][]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<{ [key: string]: any[] }>({ 1: [[null, null], [null, null]], 2: [[null, null], [null, null]], 3: [[null, null], [null, null]], 4: [[null, null], [null, null]], 5: [[null, null], [null, null], [null, null], [null, null]], 6: [[null, null], [null, null]], 7: [[null, null], [null, null]], 8: [[null, null], [null, null]], 9: [[null, null], [null, null]], 10: [[null, null], [null, null], [null, null], [null, null]], 11: [[null, null]], 12: [[null, null]], 13: [[null, null]], 14: [[null, null]], 15: [[null, null]] });
  const [simTime, setSimTime] = useState(1000)

  function getRandomTimeInRange() {
    const hours = Math.floor(Math.random() * (22 - 10) + 10);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);

    const dateTime = new Date();
    dateTime.setHours(hours, minutes, seconds);
    return dateTime;
  }

  const actionData = useActionData<typeof clientAction>();

  useEffect(() => {
    if (actionData && !actionData.error) {
      setSimTime(Math.floor((actionData * 1000) / 60))
    }
  }, [actionData]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (playPause) {
      timer = setInterval(() => {
        setClock((prevClock) => new Date(prevClock.getTime() + 1000));
      }, simTime);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playPause, simTime]);

  useEffect(() => {
    if (clock.toLocaleTimeString() in data) {
      const visitData = data[clock.toLocaleTimeString()];
      const newGroup = visitData['group_composition'].map((i) =>
        getEmoji(i['age'], i['gender'])
      );
      if (newGroup.length > 0) {
        setQueue((prevQueue) => [...prevQueue, [visitData['uuid'], newGroup]]);
      }
    }
  }, [clock]);

  const handlePlayPauseToggle = () => {
    setPlayPause(!playPause);
  };

  const handleReload = () => {
    setClock(getRandomTimeInRange());
    setPlayPause(true);
    setQueue([]);
    setTableData({ 1: [[null, null], [null, null]], 2: [[null, null], [null, null]], 3: [[null, null], [null, null]], 4: [[null, null], [null, null]], 5: [[null, null], [null, null], [null, null], [null, null]], 6: [[null, null], [null, null]], 7: [[null, null], [null, null]], 8: [[null, null], [null, null]], 9: [[null, null], [null, null]], 10: [[null, null], [null, null], [null, null], [null, null]], 11: [[null, null]], 12: [[null, null]], 13: [[null, null]], 14: [[null, null]], 15: [[null, null]] })
  };

  const handleQueueClick = (index: number, uuid: string) => {
    setSelectedQueue(uuid);
  };

  const handleTableClick = (index: number) => {
    setSelectedTable(String(index));
  };

  useEffect(() => {
    if (selectedQueue && selectedTable) {
      processSelection(selectedQueue, selectedTable);
      setSelectedQueue('');
      setSelectedTable('');
    }
  }, [selectedQueue, selectedTable]);

  const processSelection = (selectedQueue: string, selectedTable: string) => {
    const foundEntry = Object.entries(data).find(([_, value]) =>
      value.uuid === selectedQueue
    );
    const result = foundEntry ? foundEntry[1] : undefined;
    const group_composition = result?.group_composition.map(person => [person.age, person.gender]) || [];

    if (
      group_composition.length > (tableData[selectedTable]?.length || 0) ||
      tableData[selectedTable]?.some(row => row.some(value => value !== null))
    ) {
      return;
    }

    setTableData(prevState => {
      const targetTableData = prevState[selectedTable] || [];
      const targetLength = targetTableData.length;

      const paddedGroupComposition = [
        ...group_composition,
        ...Array(Math.max(0, targetLength - group_composition.length)).fill([null, null])
      ];

      return {
        ...prevState,
        [selectedTable]: paddedGroupComposition
      };
    });

    setQueue(prevState => {
      return prevState.filter((_, i) => i !== queue.findIndex(item => item[0] === selectedQueue));
    });
  };


  const generateTable1 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(1)}>
        <p>1</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['1'][0][0], tableData['1'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['1'][1][0], tableData['1'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable2 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(2)}>
        <p>2</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['2'][0][0], tableData['2'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['2'][1][0], tableData['2'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable3 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(3)}>
        <p>3</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['3'][0][0], tableData['3'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['3'][1][0], tableData['3'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable4 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(4)}>
        <p>4</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['4'][0][0], tableData['4'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['4'][0][0], tableData['4'][0][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable5 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(5)}>
        <p>5</p>
        <div className="">
          <div className="flex">
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['5'][0][0], tableData['5'][0][1])}</p>
            </div>
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['5'][1][0], tableData['5'][1][1])}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['5'][2][0], tableData['5'][2][1])}</p>
            </div>
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['5'][3][0], tableData['5'][3][1])}</p>
            </div>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable6 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(6)}>
        <p>6</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['6'][0][0], tableData['6'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['6'][1][0], tableData['6'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable7 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(7)}>
        <p>7</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['7'][0][0], tableData['7'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['7'][1][0], tableData['7'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable8 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(8)}>
        <p>8</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['8'][0][0], tableData['8'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['8'][1][0], tableData['8'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable9 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(9)}>
        <p>9</p>
        <div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['9'][0][0], tableData['9'][0][1])}</p>
          </div>
          <div className="w-10 h-10 border flex items-center justify-center">
            <p className="text-xl">{getEmoji(tableData['9'][1][0], tableData['9'][1][1])}</p>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable10 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(10)}>
        <p>10</p>
        <div className="">
          <div className="flex">
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['10'][0][0], tableData['10'][0][1])}</p>
            </div>
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['10'][1][0], tableData['10'][1][1])}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['10'][2][0], tableData['10'][2][1])}</p>
            </div>
            <div className="w-10 h-10 border flex items-center justify-center">
              <p className="text-xl">{getEmoji(tableData['10'][3][0], tableData['10'][3][1])}</p>
            </div>
          </div>
          <div className="w-full h-14 border">
            <p className="text-xs text-center"></p>
          </div>
        </div>
      </button>
    )
  }

  const generateTable11 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(11)}>
        <p>11</p>
        <div className="w-10 h-10 border flex items-center justify-center">
          <p className="text-xl">{getEmoji(tableData['11'][0][0], tableData['11'][0][1])}</p>
        </div>
        <div className="w-10 h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </button>
    )
  }

  const generateTable12 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(12)}>
        <p>12</p>
        <div className="w-10 h-10 border flex items-center justify-center">
          <p className="text-xl">{getEmoji(tableData['12'][0][0], tableData['12'][0][1])}</p>
        </div>
        <div className="w-10 h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </button>
    )
  }

  const generateTable13 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(13)}>
        <p>13</p>
        <div className="w-10 h-10 border flex items-center justify-center">
          <p className="text-xl">{getEmoji(tableData['13'][0][0], tableData['13'][0][1])}</p>
        </div>
        <div className="w-10 h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </button>
    )
  }

  const generateTable14 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(14)}>
        <p>14</p>
        <div className="w-10 h-10 border flex items-center justify-center">
          <p className="text-xl">{getEmoji(tableData['14'][0][0], tableData['14'][0][1])}</p>
        </div>
        <div className="w-10 h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </button>
    )
  }

  const generateTable15 = () => {
    return (
      <button className="m-4 flex flex-col items-center" onClick={() => handleTableClick(15)}>
        <p>15</p>
        <div className="w-10 h-10 border flex items-center justify-center">
          <p className="text-xl">{getEmoji(tableData['15'][0][0], tableData['15'][0][1])}</p>
        </div>
        <div className="w-10 h-14 border">
          <p className="text-xs text-center"></p>
        </div>
      </button>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="w-full h-1/4 flex flex-col">
        <Header
          clock={clock}
          playPause={playPause}
          onPlayPauseToggle={handlePlayPauseToggle}
          onReload={handleReload}
        />
        <div className="w-full max-h-full flex flex-wrap overflow-y-auto">
          {queue.map((item, index) => (
            <button
              key={index}
              className={`relative transition-colors ${selectedQueue === item[0]
                ? 'bg-gray-500 text-white'
                : 'hover:bg-gray-100'
                }`}
              onClick={() => handleQueueClick(index, item[0])}
            >
              <p className="text-4xl m-1">{item[1][0]}</p>
              <p className="text-xs absolute bottom-0 right-0">{item[1].length}</p>
            </button>
          ))}
        </div>
      </div>
      <hr className="border-2 border-primary mb-4 w-full" />
      <div className="w-full flex-1 flex justify-center items-center flex-col">
        <div className="flex items-center">
          {generateTable1()}
          {generateTable2()}
          {generateTable3()}
          {generateTable4()}
          {generateTable5()}
        </div>
        <div className="flex items-center">
          {generateTable6()}
          {generateTable7()}
          {generateTable8()}
          {generateTable9()}
          {generateTable10()}
        </div>
        <div className="flex items-center">
          {generateTable11()}
          {generateTable12()}
          {generateTable13()}
          {generateTable14()}
          {generateTable15()}
        </div>
      </div>
    </div>
  );
}