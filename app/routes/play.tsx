import Header from "~/components/header";
import Tables from "~/components/tables";

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="w-full h-1/6 flex flex-col">
        <Header />
        <div className="flex items-start justify-start text-left">
          <p></p>
        </div>
      </div>
      <hr className="border-2 border-primary my-4 w-full" />
      <div className="w-full flex-1 flex justify-center items-center flex-col">
        <Tables />
      </div>
    </div >
  );
}