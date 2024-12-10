import { useLocation } from '@remix-run/react';

export default function Score() {
  const location = useLocation();
  const { name, year, score, uuid } = location.state;

  return (
    <div>
      <p>uuid:{uuid}</p>
      <p>name:{name}</p>
      <p>year:{year}</p>
      <p>score:{score}</p>
    </div>
  )
}