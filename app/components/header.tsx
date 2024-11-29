import { useEffect, useState } from "react";
import { IoPlayBackCircleSharp, IoPlayCircleSharp, IoPlayForwardCircleSharp, IoReloadCircleSharp, IoStopCircleSharp } from "react-icons/io5";

export default function Header() {
  const [clock, setClock] = useState(getRandomTimeInRange())
  const [playBack, setPlayBack] = useState(false)
  const [playPause, setPlayPause] = useState(true)
  const [playForward, setPlayForward] = useState(false)
  const [reload, setReload] = useState(true)

  function getRandomTimeInRange() {
    const hours = Math.floor(Math.random() * (22 - 10) + 10)
    const minutes = Math.floor(Math.random() * 60)
    const seconds = Math.floor(Math.random() * 60)

    const dateTime = new Date()
    dateTime.setHours(hours, minutes, seconds)
    return dateTime;
  }

  useEffect(() => {
    let timer: any
    if (playPause) {
      timer = setInterval(() => {
        setClock(prevClock => new Date(prevClock.getTime() + 1000))
      }, 84)
    }
    return () => clearInterval(timer)
  }, [playPause]);

  const handlePlayBack = () => {
    setPlayBack(false)
  }

  const handlePlayPause = () => {
    setPlayPause(!playPause)
  }

  const handlePlayForward = () => {
    setPlayForward(false)
  }

  const handleReload = () => {
    setClock(getRandomTimeInRange())
  }

  return (
    <div className="navbar bg-primary">
      <div className="flex-1">
        <p className="text-xl font-bold m-4">金曜日 {clock.toLocaleTimeString()}</p>
      </div>
      <div className="flex-none btn-ghost text-4xl">
        {/* {playBack ?
            <button className="ml-3" onClick={handlePlayBack}>
            <IoPlayBackCircleSharp />
            </button> :
            <p className='ml-3 text-gray-500'>
            <IoPlayBackCircleSharp />
            </p>
            } */}
        <button className="ml-3" onClick={handlePlayPause}>
          {playPause ? <IoStopCircleSharp /> : <IoPlayCircleSharp />}
        </button>
        {/* {playForward ?
            <button className="ml-3" onClick={handlePlayForward}>
            <IoPlayForwardCircleSharp />
            </button> :
            <p className='ml-3 text-gray-500'>
            <IoPlayForwardCircleSharp />
            </p>
            } */}
        {reload ?
          <button className="ml-3" onClick={() => document.getElementById('my_modal_1').showModal()}>
            <IoReloadCircleSharp />
          </button> :
          <p className='ml-3 text-gray-500'>
            <IoReloadCircleSharp />
          </p>
        }
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="py-4 text-center font-bold">やり直す？</p>
          <div className="modal-action">
            <form method="dialog" className="w-full flex items-center justify-center">
              <button className="btn bg-neutral" onClick={handleReload}>やり直す</button>
              <div className="flex-1"></div>
              <button className="btn bg-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}