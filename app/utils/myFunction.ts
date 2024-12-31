import { v4 as uuidv4 } from "uuid";

export function getEmoji(age: number, gender: string): string {
  if (age == null) {
    return "";
  } else if (age < 0) {
    throw new Error("Age must be 0 or above.");
  }

  if (gender === "M") {
    if (age < 12) return "👦";
    if (age < 18) return "🧑";
    if (age < 60) return "👨";
    return "👴";
  } else if (gender === "F") {
    if (age < 12) return "👧";
    if (age < 18) return "🧑";
    if (age < 60) return "👩";
    return "👵";
  } else {
    return "🤷";
  }
}

const groupRatios = {
  1: 0.13,
  2: 0.52,
  4: 0.35,
};

function getRandomGroupSize(): number {
  const rand = Math.random();
  let cumulative = 0;

  for (const [groupSize, ratio] of Object.entries(groupRatios)) {
    cumulative += ratio;
    if (rand <= cumulative) {
      return parseInt(groupSize);
    }
  }
  return 1;
}

function getGroupComposition(size: number) {
  const group_composition = [];
  for (let i: number = 0; i < size; i++) {
    group_composition.push(getRandomPerson());
  }
  return group_composition;
}

interface PersonData {
  age: number;
  gender: Gender;
}

function getRandomPerson(): PersonData {
  const totalPopulation = (124240000)[2];
  const under15Ratio = 0.1149;
  const workingAgeRatio = 0.5957;
  const elderlyRatio = 0.2894;

  const rand = Math.random();
  let age: number;

  if (rand < under15Ratio) {
    age = Math.floor(Math.random() * 15);
  } else if (rand < under15Ratio + workingAgeRatio) {
    age = Math.floor(Math.random() * 50) + 15;
  } else {
    age = Math.floor(Math.random() * 36) + 65;
  }

  const gender = Math.random() < 0.486 ? "M" : "F";

  return {
    age,
    gender,
  };
}

function generateLognormalValue(mean: number, stdDev: number): number {
  const mu = Math.log(mean ** 2 / Math.sqrt(stdDev ** 2 + mean ** 2));
  const sigma = Math.sqrt(Math.log(1 + stdDev ** 2 / mean ** 2));

  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return Math.exp(mu + sigma * z) * 60;
}

function generateParameter(datetime: Date): number[] {
  let mean = 60;
  let stdDev = 30;
  let baseArrivalRate = 46 / 3600;

  const hour = datetime.getHours();
  const isWeekend = datetime.getDay() === 0 || datetime.getDay() === 6;

  if (hour < 11) {
    mean = 45;
    stdDev = 20;
    baseArrivalRate *= 0.8;
  } else if (hour >= 11 && hour < 14) {
    mean = 50;
    stdDev = 15;
    baseArrivalRate *= 2.5;
  } else if (hour >= 14 && hour < 18) {
    mean = 70;
    stdDev = 35;
    baseArrivalRate *= 1.2;
  } else {
    mean = 90;
    stdDev = 40;
    baseArrivalRate *= 0.6;
  }

  if (isWeekend) {
    mean *= 0.7;
    stdDev *= 0.8;
    baseArrivalRate *= 1.8;
  }

  return [mean, stdDev, baseArrivalRate];
}

export function generateRandomArrival(date: Date): {
  group_composition: Array<1>;
  duration: number;
} | null {
  const [a1, a2, a3] = generateParameter(date);
  const rand = Math.random();
  if (rand <= a3) {
    const uuid = uuidv4();
    const departure_time = -1;
    const duration = Math.min(generateLognormalValue(a1, a2));
    const group_composition = getGroupComposition(getRandomGroupSize());
    return { uuid, departure_time, duration, group_composition };
  }
  return null;
}

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

export function getWeekday(date: Date): string {
  return weekdays[date.getDay()] + "曜日";
}

export function generateOccupancy(datetime: Date): number {
  const [mean, stdDev, baseArrivalRate] = generateParameter(datetime);
  const totalSeats = 22;
  const simulationSteps = 500;
  let occupiedSeats = 0;
  let seatDurations: number[] = [];

  for (let step = 0; step < simulationSteps; step++) {
    seatDurations = seatDurations.filter((duration) => duration > 0);
    occupiedSeats = seatDurations.length;

    if (Math.random() <= baseArrivalRate) {
      const groupSize = getRandomGroupSize();
      const duration = generateLognormalValue(mean, stdDev);

      if (occupiedSeats + groupSize <= totalSeats) {
        for (let i = 0; i < groupSize; i++) {
          seatDurations.push(duration);
        }
      }
    }

    seatDurations = seatDurations.map((duration) => duration - 1);
  }

  return occupiedSeats / totalSeats;
}

export function getRandomNumbers(ratio: number): number[] {
  const total = 22;

  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  const countToSelect = Math.floor(numbers.length * ratio);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers.slice(0, countToSelect);
}

export function startOccupy(date, groupSize) {
  const [a1, a2, a3] = generateParameter(date);
  const duration = Math.min(generateLognormalValue(a1, a2));
  const group_composition = getGroupComposition(groupSize);
  return { duration, group_composition };
}
