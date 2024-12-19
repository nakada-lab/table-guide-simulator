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
    /* (async () => {
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
    })(); */
    const tmp = [
      {
        "id": 1,
        "uuid": "059b4adb-bf12-4e98-a827-c8bdd04f7578",
        "name": "Name1",
        "year": 2,
        "score": 29,
        "duration": [1043, 638, 97, 1866, 222, 579, 379, 1635, 1616, 1248]
      },
      {
        "id": 2,
        "uuid": "6eafd34d-c3dc-40cb-9c97-911739e8079d",
        "name": "Name2",
        "year": 2,
        "score": 524,
        "duration": [809, 940, 294, 33, 1177, 1367, 516, 646, 882, 277]
      },
      {
        "id": 3,
        "uuid": "e34e2dda-6640-4f8a-9efb-c723db6c4892",
        "name": "Name3",
        "year": 4,
        "score": 417,
        "duration": [383, 1393, 1676, 1579, 892, 1271, 1552, 1141, 470, 530]
      },
      {
        "id": 4,
        "uuid": "5809ae96-a557-40e4-88de-7a05511af3e0",
        "name": "Name4",
        "year": 2,
        "score": 577,
        "duration": [1659, 613, 141, 1834, 1280, 1832, 1787, 1404, 641, 137]
      },
      {
        "id": 5,
        "uuid": "b65b93f1-d914-4940-b48a-5604e6626db0",
        "name": "Name5",
        "year": 3,
        "score": 915,
        "duration": [1217, 1350, 1678, 631, 442, 573, 1603, 49, 818, 478]
      }, {
        "id": 6,
        "uuid": "28f1358b-1d74-4014-a3e5-f3b359140823",
        "name": "Name6",
        "year": 2,
        "score": 29,
        "duration": [1043, 638, 97, 1866, 222, 579, 379, 1635, 1616, 1248]
      },
      {
        "id": 7,
        "uuid": "e2072c73-8098-4919-966b-ccf4ed2d97ab",
        "name": "Name7",
        "year": 2,
        "score": 417,
        "duration": [1359, 1138, 1533, 1130, 1406, 1787, 1781, 1083, 1709, 1007]
      },
      {
        "id": 8,
        "uuid": "7e285a92-bd2c-4690-818a-3015166d09e0",
        "name": "Name8",
        "year": 1,
        "score": 310,
        "duration": [1968, 1256, 1024, 1588, 502, 454, 1335, 1547, 1604, 1898]
      },
      {
        "id": 9,
        "uuid": "8aeb2444-9251-421e-9fa3-78532af46279",
        "name": "Name9",
        "year": 1,
        "score": 512,
        "duration": [1039, 741, 1684, 1761, 1338, 1646, 1883, 1127, 453, 868]
      },
      {
        "id": 10,
        "uuid": "887d8291-4c1e-4472-858b-96f78ec1271a",
        "name": "Name10",
        "year": 4,
        "score": 577,
        "duration": [56, 1035, 328, 828, 246, 1678, 1072, 359, 1254, 907]
      },
      {
        "id": 11,
        "uuid": "66ad857e-5163-4a8b-940b-81c3593af1de",
        "name": "Name11",
        "year": 1,
        "score": 589,
        "duration": [1159, 1932, 1620, 1148, 1333, 1078, 1244, 1359, 974, 1993]
      }, {
        "id": 12,
        "uuid": "1a2b3c4d-5e6f-7g8h-9i0j-123456789abc",
        "name": "Name12",
        "year": 3,
        "score": 678,
        "duration": [1200, 1450, 890, 1345, 980, 1120, 1500, 800, 950, 1100]
      },
      {
        "id": 13,
        "uuid": "2b3c4d5e-6f7g-8h9i-0j1k-23456789abcd",
        "name": "Name13",
        "year": 1,
        "score": 345,
        "duration": [600, 750, 890, 1020, 560, 720, 830, 910, 670, 800]
      },
      {
        "id": 14,
        "uuid": "3c4d5e6f-7g8h-9i0j-1k2l-3456789abcde",
        "name": "Name14",
        "year": 4,
        "score": 890,
        "duration": [1300, 1450, 1600, 1750, 1900, 2000, 2100, 2200, 2300, 2400]
      },
      {
        "id": 15,
        "uuid": "4d5e6f7g-8h9i-0j1k-2l3m-456789abcdef",
        "name": "Name15",
        "year": 2,
        "score": 456,
        "duration": [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400]
      },
      {
        "id": 16,
        "uuid": "5e6f7g8h-9i0j-1k2l-3m4n-56789abcdefg",
        "name": "Name16",
        "year": 3,
        "score": 789,
        "duration": [1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300]
      }, {
        "id": 17,
        "uuid": "6f7g8h9i-0j1k-2l3m-4n5o-6789abcdefgh",
        "name": "Name17",
        "year": 1,
        "score": 234,
        "duration": [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700]
      },
      {
        "id": 18,
        "uuid": "7g8h9i0j-1k2l-3m4n-5o6p-789abcdefghij",
        "name": "Name18",
        "year": 2,
        "score": 567,
        "duration": [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
      },
      {
        "id": 19,
        "uuid": "8h9i0j1k-2l3m-4n5o-6p7q-89abcdefghijk",
        "name": "Name19",
        "year": 3,
        "score": 890,
        "duration": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]
      },
      {
        "id": 20,
        "uuid": "9i0j1k2l-3m4n-5o6p-7q8r-90abcdefghijkl",
        "name": "Name20",
        "year": 4,
        "score": 123,
        "duration": [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300]
      },
    ]
    setScore(tmp)
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