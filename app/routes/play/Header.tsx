import {
  IoPlayBackCircleSharp,
  IoPlayCircleSharp,
  IoPlayForwardCircleSharp,
  IoReloadCircleSharp,
  IoStopCircleSharp,
} from "react-icons/io5";

type HeaderProps = {
  clock: Date;
  playPause: boolean;
  onPlayPauseToggle: () => void;
  onReload: () => void;
  score: number[];
};

const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

function getWeekday(date: Date): string {
  return weekdays[date.getDay()];
}

export default function Header({
  clock,
  playPause,
  onPlayPauseToggle,
  onReload,
  score
}: HeaderProps) {
  return (
    <div className="navbar bg-primary">
      <div className="grid grid-cols-3 w-full">
        <div className="flex justify-start min-w-[200px] flex-col">
          <p>{clock.toLocaleDateString() + ' ' + getWeekday(clock) + '曜日'}</p>
          <p className="text-xl font-bold">{clock.toLocaleTimeString()}</p>
        </div>
        <div className="flex justify-center">
          <p className="text-xl text-center">Penalty:
            {isNaN([...score].reduce((acc, val) => acc + val, 0) / [...score].length)
              ? 0
              : Math.round([...score].reduce((acc, val) => acc + val, 0) / [...score].length)}
          </p>
        </div>
        <div className="flex justify-end btn-ghost text-4xl">
          <button className="ml-3" onClick={onPlayPauseToggle}>
            {playPause ? <IoStopCircleSharp /> : <IoPlayCircleSharp />}
          </button>
          <button className="ml-3" onClick={() => document.getElementById("my_modal_1")?.showModal()}>
            <IoReloadCircleSharp />
          </button>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="py-4 text-center font-bold">やり直す？</p>
          <div className="modal-action">
            <form method="dialog" className="w-full flex items-center justify-center">
              <button className="btn bg-neutral" onClick={onReload}>
                やり直す
              </button>
              <div className="flex-1"></div>
              <button className="btn bg-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
