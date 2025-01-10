import Dialog from "./Dialog";
import Header from "./Header";
import TableGenerator from "./Table";
import { ClientActionFunctionArgs, useActionData, useNavigate } from "@remix-run/react";
import { generateOccupancy, generateRandomArrival, getEmoji, getRandomNumbers, getWeekday, startOccupy } from "~/utils/myFunction";
import { supabase } from "~/utils/supabase";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  //const min = formData.get("min");
  const min = 2
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
  const [queue, setQueue] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<{ [key: string]: any[] }>(tables);
  const [simTime, setSimTime] = useState([11.1, 11.1])
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [value, setValue] = useState(1);
  const [score, setScore] = useState<number[]>([])
  const [uuid, setUuid] = useState<string>('');
  const [leave, setLeave] = useState([0, 0])
  const [log, setLog] = useState([{}]);
  const [visitors, setVisitors] = useState(0)
  const startTimeRef = useRef(null);
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const yearRef = useRef(null);
  const executedRef = useRef(false)
  const refFirstRef = useRef(true);
  const navigate = useNavigate();

  function generateTables(definitions) {
    const tables = {};
    definitions.forEach(({ start, end, tableAmount }) => {
      for (let i = start; i <= end; i++) {
        const emptyTable = Array(tableAmount).fill('')
        tables[i] = [null, emptyTable, null]
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

  const splitArrayAt = (array, n) => [array.slice(0, n), array.slice(n)];

  const divider = (index: number) => {
    const [first, second] = splitArrayAt(queue[index][1], value);
    const front = index > 0 ? queue.slice(0, index) : [];
    const dividedArray = [
      [queue[index][0], first, queue[index][2], queue[index][3], queue[index][4], [0, 10800000]],
      [uuidv4(), second, queue[index][2], queue[index][3], queue[index][4], [0, 10800000]]
    ];

    const behinde = index < queue.length - 1 ? queue.slice(index + 1) : [];

    const newQueue = [...front, ...dividedArray, ...behinde];
    setQueue(newQueue)
    setValue(1)
    setIsButtonEnabled(false)
    setPlayPause(true)
  }

  function getRandomTimeInRange() {
    const start = new Date(2024, 1, 1);
    const end = new Date(2024, 12, 31);
    let dateTime = new Date()
    for (let i: number = 0; i < 1000; i++) {
      dateTime = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      if (9 <= dateTime.getHours() && dateTime.getHours() <= 20) break
    }
    return dateTime;
  }

  const actionData = useActionData<typeof clientAction>();

  useEffect(() => {
    if (actionData && !actionData.error) {
      setSimTime([Math.floor((actionData['min'] * 1000) / 60), Math.floor((actionData['min'] * 1000) / 60)])
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
              newState[key] = [prevState[key][0] - 1, prevState[key][1], prevState[key][2]];
              if (prevState[key][0] === 0) {
                newState[key] = [null, tables[key][1]];
              }
            }
          }
          return newState;
        });

        setQueue(prevQueue =>
          prevQueue.map(item => [
            item[0], item[1], item[2], item[3], item[4] + 1, [item[5][0] + 1, item[5][1]]
          ])
        );

        if (!startTimeRef.current) {
          startTimeRef.current = clock;
        } else if (clock.getTime() - startTimeRef.current.getTime() >= 7200000) {
          if (!executedRef.current) {
            insertScore().then(() => {
              clearInterval(timer);
              navigate('/score', { state: { uuid: uuid } });
            });
          }
        }

        const hasNoNullValues = Object.values(tableData).every(arr =>
          arr.length > 0 && arr[0] !== null
        );

        if (hasNoNullValues) {
          setSimTime([0.000000001, simTime[1]])
        } else {
          setSimTime([simTime[1], simTime[1]])
        }

      }, simTime[0]);
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
        { uuid: uuid, name: nameRef.current, year: yearRef.current, score: Math.round(([...score, ...queue.map((s) => s[4])].reduce((acc, val) => acc + val, 0) / [...score, ...queue.map((s) => s[4])].length) * (visitors / 46)), duration: [...score, ...queue.map((s) => s[4])], leave: leave, date: new Date(clock.getTime() - (3 * 60 * 60 * 1000)), weekday: getWeekday(clock), rotation: visitors / 46 },
      ])
      .select();

    const { data: logData, error: logDataError } = await supabase
      .from('log')
      .insert([
        { uuid: uuid, log: log },
      ])
      .select()

  }

  const generatePatience = (datetime: Date) => {
    const hour = datetime.getHours();
    const isWeekend = datetime.getDay() === 0 || datetime.getDay() === 6;
    let patienceTime = 60;

    if (hour < 11) {
      patienceTime = 45;
    } else if (hour >= 11 && hour < 14) {
      patienceTime = 30;
    } else if (hour >= 14 && hour < 18) {
      patienceTime = 70;
    } else {
      patienceTime = 90;
    }

    if (isWeekend) {
      patienceTime *= 0.7;
    }

    return patienceTime * 100;
  }

  useEffect(() => {
    const lim = Math.floor(Math.random() * (30 - 16)) + 15;
    const arrive = generateRandomArrival(clock)
    if (queue.length >= lim) {
      setLeave(prevLeave => [prevLeave[0], prevLeave[1] + 1]);
      setScore(prevState => [...prevState, 1200])
      return
    } else {
      if (arrive != null) {
        const newGroup = arrive['group_composition'].map((i) =>
          getEmoji(i['age'], i['gender'])
        );
        if (newGroup.length > 0) {
          setQueue((prevQueue) => [...prevQueue, [arrive['uuid'], newGroup, Math.round(arrive['duration']), clock, 0, [0, generatePatience(clock)]]]);
        }
      }
    }
  }, [clock]);

  useEffect(() => {
    const selectedIndex = queue.findIndex(item => item[0] === selectedQueue);

    const hasItemToRemove = queue.some((item, index) =>
      index !== selectedIndex && item[5][0] >= item[5][1]
    );

    if (hasItemToRemove) {
      const newQueue = queue.filter((item, index) =>
        index === selectedIndex || item[5][0] < item[5][1]
      );

      setQueue(newQueue);
      setLeave(prevLeave => [prevLeave[0] + 1, prevLeave[1]]);
      setScore(prevState => [...prevState, 600]);
    }
  }, [queue, selectedQueue]);

  const handleReload = () => {
    startTimeRef.current = null;
    setClock(getRandomTimeInRange());
    setPlayPause(true);
    setQueue([]);
    setTableData(tables)
    setScore([])
    occupancy()
  };

  const handleQueueClick = (index: number, uuid: string, len: number) => {
    setSelectedQueue(prevState => prevState === uuid ? '' : uuid);
    setIsButtonEnabled(len > 1);
  };


  useEffect(() => {
    if (selectedQueue && selectedTable) {
      processSelection(selectedQueue, selectedTable);
      setSelectedQueue('');
      setSelectedTable('');
    } else if (selectedQueue) {
      setPlayPause(false)
    } else if (!selectedQueue) {
      setPlayPause(true)
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
        [selectedTable]: [queue[queueIndex][2], paddedEmojiGroup, queue[queueIndex][0]]
      };
    });

    //setScore(prevState => [...prevState, [new Date(queue[queueIndex][3]).getTime(), clock.getTime()]])
    setScore(prevState => [...prevState, queue[queueIndex][4]])

    setVisitors(visitors + queue[queueIndex][1].length)

    setQueue(prevState =>
      prevState.filter((_, i) => i !== queueIndex)
    );
    setIsButtonEnabled(false)
  };

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      setPlayPause(false);
    }
  };

  useEffect(() => {
    if (refFirstRef.current) {
      occupancy()
      refFirstRef.current = false;
    }
  }, [])

  const occupancy = () => {
    const occupancyRatio = generateOccupancy(clock)
    const occupy = getRandomNumbers(occupancyRatio)
    for (let i: number = 0; i < occupy.length; i++) {
      const arrive = startOccupy(clock, tables[String(occupy[i])][1].length)
      const emoji = []
      for (let j: number = 0; j < arrive.group_composition.length; j++) {
        emoji.push(getEmoji(arrive.group_composition[j].age, arrive.group_composition[j].gender))
      }
      tables[String(occupy[i])] = [
        Math.round(arrive.duration),
        emoji,
        null
      ]
    }
  }

  useEffect(() => {
    setLog([...log, [clock, {
      queue: queue,
      tableData: tableData
    }]])
  }, [queue.length])

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="w-full h-1/5 flex flex-col relative">
        <Header
          clock={clock}
          playPause={playPause}
          onPlayPauseToggle={() => { setPlayPause(!playPause); }}
          onReload={handleReload}
          score={score}
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
          <Dialog
            dialogRef={dialogRef}
            queue={queue}
            selectedQueue={selectedQueue}
            divider={divider}
            value={value}
            setValue={setValue}
            setPlayPause={setPlayPause}
          />
          <button
            className={`btn absolute bottom-0 right-0 z-10 m-1 text-xs ${!isButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!isButtonEnabled}
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.showModal();
                setPlayPause(false)
              }
            }}
          >
            分ける
          </button>
        </div>
      </div>
      <hr className="border-2 border-primary mb-4 w-full" />
      <div className="w-full flex-1 flex items-center flex-col">
        {generateTableElements(tableDefinitions)}
      </div>
    </div >
  );
}