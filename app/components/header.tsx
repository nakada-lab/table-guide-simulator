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
};

export default function Header({ clock, playPause, onPlayPauseToggle, onReload }: HeaderProps) {
  return (
    <div className="navbar bg-primary">
      <div className="flex-1">
        <p className="text-xl font-bold m-4">金曜日 {clock.toLocaleTimeString()}</p>
      </div>
      <div className="flex-none btn-ghost text-4xl">
        <button className="ml-3" onClick={onPlayPauseToggle}>
          {playPause ? <IoStopCircleSharp /> : <IoPlayCircleSharp />}
        </button>
        <button className="ml-3" onClick={() => document.getElementById("my_modal_1")?.showModal()}>
          <IoReloadCircleSharp />
        </button>
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
