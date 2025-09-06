import Unis from "@/components/unis";
import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`
type User = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT";
};

export type Unis = {
  id: number;
  name: string;
  location: string;
}
async function getUsers(): Promise<User[]> {
  const res = await axios.get<User[]>(`${baseUrl}/users/`);
  return res.data;
}


export default async function Home() {
  const users = await getUsers();

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20">
      {users.length} users loaded
    </div>
  );
}


// const uni = await prisma.university.create({
//   data: {
//     name: body.name,
//     location: body.location ?? null,
//   },
// });
