import Unis from "@/components/unis";
import EventsPage from "./events/page";

export type Unis = {
  id: number;
  name: string;
  location: string;
}

export default async function Home() {
  return (
    <>
    <div className="flex justify-center mt-50">
      <h1 className="text-5xl font-extrabold">Campus Event Organizer</h1>
    </div>
      <EventsPage />
    </>
  );
}