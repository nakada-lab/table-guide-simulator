import { useState, useEffect, useRef } from "react";
import Header from "~/components/header";
import { getEmoji } from "~/utils/myFunction";
import data from 'app/models/data.json';
import { ClientActionFunctionArgs, useActionData, useNavigate } from "@remix-run/react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "~/utils/supabase";
import TableGenerator from "./Table";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const min = formData.get("min");
  const name = formData.get('name');
  const year = formData.get('year')


  return {
    min: min, name: name, year: year
  }
}

export default function Play() {
  const tableDefinitions = [
    { start: 1, end: 6, tableAmount: 2 },
    { start: 7, end: 12, tableAmount: 2 },
    { start: 13, end: 16, tableAmount: 4 },
    { start: 17, end: 22, tableAmount: 1 },
  ]
  const tables = generateTables(tableDefinitions)
  const [clock, setClock] = useState(getRandomTimeInRange());
  const [playPause, setPlayPause] = useState(true);
  const [queue, setQueue] = useState<string[][]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<{ [key: string]: any[] }>(tables);
  const [simTime, setSimTime] = useState(1000)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [value, setValue] = useState(1);
  const [score, setScore] = useState<number[]>([])
  const [uuid, setUuid] = useState<string>('');
  const startTimeRef = useRef(null);
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const yearRef = useRef(null);
  const executedRef = useRef(false)
  const navigate = useNavigate();


  function generateTables(definitions) {
    const tables = {};
    definitions.forEach(({ start, end, tableAmount }) => {
      for (let i = start; i <= end; i++) {
        const emptyTable = Array(tableAmount).fill('')
        tables[i] = [null, emptyTable]
      }
    });
    return tables
  }

  function generateTableElements(tableDefinitions) {
    return tableDefinitions.map(({ start, end, tableAmount }) => (
      <div key={`${start}-${end}`} className="flex items-center">
        <TableGenerator
          start={start}
          end={end}
          tableAmount={tableAmount}
          tableData={tableData}
          setSelectedTable={setSelectedTable}
        />
      </div>
    ));
  }

  const maxLength = queue[queue.findIndex(([uuid]) => uuid === selectedQueue)]?.[1]?.length ?? 0;

  const handleIncrease = () => {
    setValue(prev => Math.min(maxLength, prev + 1));
  };

  const handleDecrease = () => {
    setValue(prev => Math.max(1, prev - 1));
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
      [queue[index][0], first, queue[index][2], queue[index][3], queue[index][4]],
      [uuidv4(), second, queue[index][2], queue[index][3], queue[index][4]]
    ];

    const behinde = index < queue.length - 1 ? queue.slice(index + 1) : [];

    const newQueue = [...front, ...dividedArray, ...behinde];
    setQueue(newQueue)
    setValue(1)
    setIsButtonEnabled(false)
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
      setSimTime(Math.floor((actionData['min'] * 1000) / 60))
      const uuid = uuidv4()
      nameRef.current = actionData['name'] === '' ? uuid.split('-')[0] : actionData['name']
      yearRef.current = actionData['year']
      setUuid(uuid)
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

        setQueue(prevQueue =>
          prevQueue.map(item => [
            item[0], item[1], item[2], item[3], item[4] + 1
          ])
        );

        if (!startTimeRef.current) {
          startTimeRef.current = clock;
        } else if (clock.getTime() - startTimeRef.current.getTime() >= 3600000) {
          if (!executedRef.current) {
            insertScore().then(() => {
              clearInterval(timer);
              navigate('/score', { state: { uuid: uuid } });
            });
          }
        }
        //}, simTime);
      }, 10);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playPause, simTime, clock, navigate]);

  const insertScore = async () => {
    if (executedRef.current) return;
    executedRef.current = true;
    const { data: scoreData, error: scoreError } = await supabase
      .from('score')
      .insert([
        { uuid: uuid, name: nameRef.current, year: yearRef.current, score: Math.round([...score, ...queue.map((s) => s[4])].reduce((acc, val) => acc + val, 0) / [...score, ...queue.map((s) => s[4])].length), duration: [...score, ...queue.map((s) => s[4])] },
      ])
      .select();
  }

  const calScore = () => {
    setScore(prevState => [...prevState, ...queue.map(i => i[4])])
    return calcAve
  }

  const calcAve = () => {
    return Math.round(score.reduce((acc, val) => acc + val, 0) / score.length)
  }

  useEffect(() => {
    if (clock.toLocaleTimeString() in data) {
      const visitData = data[clock.toLocaleTimeString()];
      const newGroup = visitData['group_composition'].map((i) =>
        getEmoji(i['age'], i['gender'])
      );
      if (newGroup.length > 0) {
        setQueue((prevQueue) => [...prevQueue, [visitData['uuid'], newGroup, Math.round(visitData['duration'] / 3), clock, 0]]);
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
    setScore([])
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

    //setScore(prevState => [...prevState, [new Date(queue[queueIndex][3]).getTime(), clock.getTime()]])
    setScore(prevState => [...prevState, queue[queueIndex][4]])

    setQueue(prevState =>
      prevState.filter((_, i) => i !== queueIndex)
    );
    setIsButtonEnabled(false)
  };

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
        {generateTableElements(tableDefinitions)}
      </div>
    </div>
  );
}