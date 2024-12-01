import { getEmoji } from 'app/utils/myFunction';

export default function Tables() {
  const EmojiBox = ({ repeat = 1 }: { repeat?: number }) => (
    <>
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className="w-10 h-10 border flex items-center justify-center"
        >
          <p className="text-xl">{getEmoji(10, 'F')}</p>
        </div>
      ))}
    </>
  );

  const ComplexLayout = () => (
    <div>
      <div className="flex">
        <EmojiBox repeat={2} />
      </div>
      <div className="flex">
        <EmojiBox repeat={2} />
      </div>
      <div className="w-full h-14 border">
        <p className="text-xs text-center"></p>
      </div>
    </div>
  );

  const createTable = (start: number, end: number, has2ndDiv: boolean) => {
    return Array.from({ length: end - start + 1 }, (_, index) => (
      <button
        key={index}
        className="m-4 flex flex-col items-center"
        onClick={() => handleClick(start + index)}
      >
        <p>{start + index}</p>
        {has2ndDiv ? (
          index !== end - start ? (
            <div>
              <EmojiBox repeat={2} />
              <div className="w-full h-14 border">
                <p className="text-xs text-center"></p>
              </div>
            </div>
          ) : (
            <ComplexLayout />
          )
        ) : (
          <>
            <EmojiBox />
            <div className="w-10 h-14 border">
              <p className="text-xs text-center"></p>
            </div>
          </>
        )}
      </button>
    ));
  };
  const handleClick = (index: number) => {
    console.log(index)
    return ''
  }
  return (
    <div>
      <div className="flex items-center">{createTable(1, 5, true)}</div>
      <div className="flex items-center">{createTable(6, 10, true)}</div>
      <div className="flex items-center">{createTable(11, 15, false)}</div>
    </div>
  );
}
