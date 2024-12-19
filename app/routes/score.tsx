import { useLocation, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';

export default function Score() {
  const [score, setScore] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  let selectedUuid = '';
  if (location.state) {
    const { uuid } = location.state;
    selectedUuid = uuid;
  }

  useEffect(() => {
    (async () => {
      try {
        let { data: score, error } = await supabase
          .from('score')
          .select('*');

        if (error) {
          console.error(error);
          return;
        }
        setScore([...score].sort((a, b) => a.score - b.score));
        //setScore([...data].sort((a, b) => b.score - a.score));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-slate-400 sticky top-0 z-10">
              <tr>
                <th className="text-center">No.</th>
                <th>名前</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {score.map((item, index) => (
                <tr
                  key={item.uuid}
                  className={`${item.uuid === selectedUuid
                    ? "bg-yellow-200"
                    : "odd:bg-white even:bg-slate-100"
                    }`}
                >
                  <th className="text-center">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-slate-400 text-center">
        <button
          onClick={() => { navigate('/'); }}
          className="btn w-1/3 m-3"
        >
          Replay
        </button>
      </div>
    </div>
  );
}