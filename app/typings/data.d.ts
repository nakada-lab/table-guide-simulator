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

  interface Data {
    uuid: string;
    visit_time: string;
    departure_time: string;
    duration: number;
    group_composition: GroupComposition[];
    ordered_items: OrderedItem[];
  }

  const data: Data;

  export default data;
}
