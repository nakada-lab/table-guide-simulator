import { useLocation } from '@remix-run/react';

export default function Score() {
  const location = useLocation();
  const { name, year, score } = location.state;

  return (
    <div>
      <p>name:{name}</p>
      <p>year:{year}</p>
      <p>score:{score}</p>
    </div>
  )
}