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

const durationMean = 60 * 60;
const durationStdDev = 15 * 60;

const arrivalRate = 46 / 3600;

function randomNormal(mean: number, stdDev: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return Math.round(z * stdDev + mean);
}

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

export function generateRandomArrival(): {
  group_composition: Array<1>;
  duration: number;
} | null {
  const rand = Math.random();
  if (rand <= arrivalRate) {
    const uuid = uuidv4();
    const departure_time = 0;
    const duration = Math.max(randomNormal(durationMean, durationStdDev), 600);
    const group_composition = getGroupComposition(getRandomGroupSize());
    return { uuid, departure_time, duration, group_composition };
  }
  return null;
}
