export function getEmoji(age: number, gender: string): string {
  if (age < 0) {
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
