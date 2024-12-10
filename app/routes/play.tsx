import { useState, useEffect, useRef } from "react";
import Header from "~/components/header";
import { getEmoji } from "~/utils/myFunction";
import data from 'app/models/data.json';
import { ClientActionFunctionArgs, useActionData, useNavigate } from "@remix-run/react";
import { v4 as uuidv4 } from 'uuid';

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const min = formData.get("min");
  const name = formData.get('name');
  const year = formData.get('year')

  if (!min) {
    return { error: "時間を入力してください" };
  }

  return {
    min: min, name: name, year: year
  }
}

export default function Play() {
  const tables = { 1: [null, ['', '']], 2: [null, ['', '']], 3: [null, ['', '']], 4: [null, ['', '']], 5: [null, ['', '']], 6: [null, ['', '']], 7: [null, ['', '']], 8: [null, ['', '']], 9: [null, ['', '']], 10: [null, ['', '']], 11: [null, ['', '']], 12: [null, ['', '']], 13: [null, ['', '', '', '']], 14: [null, ['', '', '', '']], 15: [null, ['', '', '', '']], 16: [null, ['', '', '', '']], 17: [null, ['']], 18: [null, ['']], 19: [null, ['']], 20: [null, ['']], 21: [null, ['']], 22: [null, ['']] }
  const [clock, setClock] = useState(getRandomTimeInRange());
  const [playPause, setPlayPause] = useState(true);
  const [queue, setQueue] = useState<string[][]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<{ [key: string]: any[] }>(tables);
  const [simTime, setSimTime] = useState(1000)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const yearRef = useRef(null);
  const navigate = useNavigate();

  const maxLength = queue[queue.findIndex(([uuid]) => uuid === selectedQueue)]?.[1]?.length ?? 0;

  const handleIncrease = () => {
    setValue(prev => Math.min(maxLength, prev + 1));
  };

  const handleDecrease = () => {
    setValue(prev => Math.max(0, prev - 1));
  };

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const createDialog = () => {
    return (
      <dialog ref={dialogRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="">{queue[queue.findIndex(([uuid]) => uuid === selectedQueue)]?.[1]?.length ?? null}人をどう分ける？</p>
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
                <p className="ml-5">{queue[queue.findIndex(([uuid]) => uuid === selectedQueue)]?.[1]?.length - value}人</p>
              </div>
              <form method="dialog" className="w-full flex items-center justify-center">
                <button className="btn bg-neutral">
                  閉じる
                </button>
                <div className="flex-1"></div>
                <button className="btn bg-primary" onClick={() => divider(queue.findIndex(([uuid]) => uuid === selectedQueue))}>分ける</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    )
  }

  const splitArrayAt = (array: string[], n: number): [string[], string[]] => {
    const firstPart = array.slice(0, n);
    const secondPart = array.slice(n);
    return [firstPart, secondPart];
  };


  const divider = (index: number) => {
    const [first, second] = splitArrayAt(queue[index][1], value);
    const front = index > 0 ? queue.slice(0, index) : [];
    const dividedArray = [
      [queue[index][0], first, queue[index][2]],
      [uuidv4(), second, queue[index][2]]
    ];

    const behinde = index < queue.length - 1 ? queue.slice(index + 1) : [];

    const newQueue = [...front, ...dividedArray, ...behinde];
    setQueue(newQueue)
    setValue(0)
  }

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
      console.log(actionData)
      setSimTime(Math.floor((actionData['min'] * 1000) / 60))
      nameRef.current = actionData['name']
      yearRef.current = actionData['year']
    }
  }, [actionData]);

  useEffect(() => {
    let timer = null;
    if (playPause) {
      timer = setInterval(() => {
        setClock((prevClock) => new Date(prevClock.getTime() + 1000));
        setTableData((prevState) => {
          const newState = { ...prevState };
          for (const key in prevState) {
            if (prevState[key][0] != null) {
              newState[key] = [prevState[key][0] - 1, prevState[key][1]];
              if (prevState[key][0] === 0) {
                newState[key] = [null, tables[key][1]];
              }
            }
          }
          return newState;
        });

        if (!startTimeRef.current) {
          startTimeRef.current = clock;
        } else if (clock.getTime() - startTimeRef.current.getTime() >= 3600000) {
          clearInterval(timer);
          navigate('/score', {
            state: {
              nameRef: nameRef.current,
              yearRef: yearRef.current
            }
          });
        }
      }, simTime);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playPause, simTime, clock, navigate]);

  useEffect(() => {
    if (clock.toLocaleTimeString() in data) {
      const visitData = data[clock.toLocaleTimeString()];
      const newGroup = visitData['group_composition'].map((i) =>
        getEmoji(i['age'], i['gender'])
      );
      if (newGroup.length > 0) {
        setQueue((prevQueue) => [...prevQueue, [visitData['uuid'], newGroup, visitData['duration']]]);
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
    setTableData(tables)
  };

  const handleQueueClick = (index: number, uuid: string, len: number) => {
    setSelectedQueue(uuid);
    setIsButtonEnabled(len > 1);
  };

  const handleDividerClick = () => {
    openDialog()
  }

  useEffect(() => {
    if (selectedQueue && selectedTable) {
      processSelection(selectedQueue, selectedTable);
      setSelectedQueue('');
      setSelectedTable('');
    }
  }, [selectedQueue, selectedTable]);

  const processSelection = (selectedQueue: string, selectedTable: string) => {
    const queueIndex = queue.findIndex(item => item[0] === selectedQueue);
    const emojiGroup = queue[queueIndex][1];

    if (
      emojiGroup.length > (tableData[selectedTable][1]?.length || 0) ||
      tableData[selectedTable][1]?.some(value => value !== '')
    ) {
      return;
    }

    setTableData(prevState => {
      const targetTableData = prevState[selectedTable] || [null, []];
      const targetEmojiArray = targetTableData[1] || [];
      const targetLength = targetEmojiArray.length;

      const paddedEmojiGroup = [
        ...emojiGroup,
        ...Array(Math.max(0, targetLength - emojiGroup.length)).fill('')
      ];

      return {
        ...prevState,
        [selectedTable]: [queue[queueIndex][2], paddedEmojiGroup]
      };
    });

    setQueue(prevState =>
      prevState.filter((_, i) => i !== queueIndex)
    );
  };

  const generateTable = (start: number, end: number, tableAmount: number) => {
    const tables = []
    for (let i: number = start; i < end + 1; i++) {
      switch (tableAmount) {
        case 1:
          tables.push(
            <button className="m-3 flex flex-col items-center" onClick={() => setSelectedTable(String(i))} key={i}>
              <p>{i}</p>
              <div className="">
                <div>
                  <div className="w-10 h-10 border flex items-center justify-center">
                    <p className="text-xl">{tableData[String(i)][1][0]}</p>
                  </div>
                  <div className="w-full h-4 border flex items-center justify-center">
                    <p className="text-xs text-center">{tableData[String(i)][0]}</p>
                  </div>
                </div>
              </div>
            </button>
          )
          break;
        case 2:
          tables.push(
            <button className="m-3 flex flex-col items-center" onClick={() => setSelectedTable(String(i))} key={i}>
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
          )
          break;
        case 4:
          tables.push(
            <button className="m-3 flex flex-col items-center" onClick={() => setSelectedTable(String(i))} key={i}>
              <p>{i}</p>
              <div className="">
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
          )
          break;
      }
    }
    return tables
  }

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="w-full h-1/4 flex flex-col relative">
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
              className={`relative transition-colors ${selectedQueue === item[0] ? 'bg-gray-500 text-white' : 'hover:bg-gray-100'
                }`}
              onClick={() => {
                handleQueueClick(index, item[0], item[1].length);
              }}
            >
              <p className="text-4xl m-1">{item[1][0]}</p>
              <p className="text-xs absolute bottom-0 right-0">{item[1].length}</p>
            </button>
          ))}
          {createDialog()}
          <button
            className={`btn absolute bottom-0 right-0 z-10 m-1 text-xs ${!isButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!isButtonEnabled}
            onClick={() => handleDividerClick()}
          >
            分ける
          </button>
        </div>
      </div>
      <hr className="border-2 border-primary mb-4 w-full" />
      <div className="w-full flex-1 flex justify-center items-center flex-col">
        <div className="flex items-center">
          {generateTable(1, 6, 2)}
        </div>
        <div className="flex items-center">
          {generateTable(7, 12, 2)}
        </div>
        <div className="flex items-center">
          {generateTable(13, 16, 4)}
        </div>
        <div className="flex items-center">
          {generateTable(17, 22, 1)}
        </div>
      </div>
    </div>
  );
}