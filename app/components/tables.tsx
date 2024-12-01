import { getEmoji } from 'app/utils/myFunction';

export default function Tables() {
  const createTable = (start: number, end: number, has2ndDiv: boolean) => {
    return Array.from({ length: end - start + 1 }, (_, index) => (
      <button key={index} className='m-4 flex flex-col items-center' onClick={() => handleClick(start + index)}>
        <p>{start + index}</p>
        {
          has2ndDiv ?
            <>
              {
                index !== end - start ?
                  <div>
                    <div className='w-10 h-10 border items-center justify-center'>
                      <p className='text-xl'>{getEmoji(10, 'F')}</p>
                    </div>
                    <div className='w-10 h-10 border items-center justify-center'>
                      <p className='text-xl'>{getEmoji(10, 'F')}</p>
                    </div>
                    <div className="w-full h-14 border">
                      <p className="text-xs text-center"></p>
                    </div>
                  </div>
                  :
                  <div className=''>
                    <div className='flex'>
                      <div className='w-10 h-10 border items-center justify-center'>
                        <p className='text-xl'>{getEmoji(10, 'F')}</p>
                      </div>
                      <div className='w-10 h-10 border items-center justify-center'>
                        <p className='text-xl'>{getEmoji(10, 'F')}</p>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-10 h-10 border items-center justify-center'>
                        <p className='text-xl'>{getEmoji(10, 'F')}</p>
                      </div>
                      <div className='w-10 h-10 border items-center justify-center'>
                        <p className='text-xl'>{getEmoji(10, 'F')}</p>
                      </div>
                    </div>
                    <div className="w-full h-14 border">
                      <p className="text-xs text-center"></p>
                    </div>
                  </div>
              }
            </>
            :
            <>
              <div className="w-10 h-10 border flex items-center justify-center">
                <p className="text-xl">{getEmoji(10, 'F')}</p>
              </div>
              <div className="w-10 h-14 border">
                <p className="text-xs text-center"></p>
              </div>
            </>
        }
      </button>
    ));
  };

  const handleClick = (index: number) => {
    console.log(index)
    return ''
  }
  return (
    <div>
      <div className="flex items-center">
        {createTable(1, 5, true)}
      </div>
      <div className="flex items-center">
        {createTable(6, 10, true)}
      </div>
      <div className="flex items-center">
        {createTable(11, 15, false)}
      </div>
    </div>
  );
}