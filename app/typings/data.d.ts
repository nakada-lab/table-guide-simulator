declare module "/app/models/data.json" {
  interface GroupComposition {
    age: number;
    gender: "M" | "F";
  }

  interface OrderedItem {
    emoji: string;
    name: string;
    quantity: number;
  }

  interface VisitData {
    uuid: string;
    departure_time: string;
    duration: number;
    group_composition: GroupComposition[];
    ordered_items: OrderedItem[];
  }

  interface Data {
    [visit_time: string]: VisitData;
  }

  const data: Data;

  export default data;
}
