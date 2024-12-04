import { useState, useEffect } from "react";
import Header from "~/components/header";
import Tables from "~/components/tables";
import data from 'app/models/data.json';
import { getEmoji } from "~/utils/myFunction";

export default function Index() {
  const [clock, setClock] = useState(getRandomTimeInRange());
  const [playPause, setPlayPause] = useState(true);
  const [queue, setQueue] = useState<string[]>([]);

  function getRandomTimeInRange() {
    const hours = Math.floor(Math.random() * (22 - 10) + 10);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);

    const dateTime = new Date();
    dateTime.setHours(hours, minutes, seconds);
    return dateTime;
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (playPause) {
      timer = setInterval(() => {
        setClock((prevClock) => new Date(prevClock.getTime() + 1000));
      }, 84);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playPause]);


  useEffect(() => {
    if (clock.toLocaleTimeString() in data) {
      const visitData = data[clock.toLocaleTimeString()]
      const newGroup = visitData['group_composition'].map(i =>
        getEmoji(i['age'], i['gender'])
      );
      if (newGroup.length > 0) {
        setQueue(prevQueue => [...prevQueue, newGroup]);
      }
    }
  }, [clock])

  const handlePlayPauseToggle = () => {
    setPlayPause(!playPause);
  };

  const handleReload = () => {
    setClock(getRandomTimeInRange());
    setPlayPause(true);
    setQueue([])
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="w-full h-1/5 flex flex-col">
        <Header
          clock={clock}
          playPause={playPause}
          onPlayPauseToggle={handlePlayPauseToggle}
          onReload={handleReload}
        />
        <div className="flex items-start justify-start text-left">
          {queue}
        </div>
      </div>
      <hr className="border-2 border-primary my-4 w-full" />
      <div className="w-full flex-1 flex justify-center items-center flex-col">
        <Tables />
      </div>
    </div >
  );
}
