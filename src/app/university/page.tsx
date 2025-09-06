import Unis from "@/components/unis";
import axios from "axios";
import { Unis as Uni } from "../page";
const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`

async function getUnis(): Promise<Uni[]> {
    const res = await axios.get<Uni[]>(`${baseUrl}/university/`);
    return res.data
}
export default async function University() {
    const unis = await getUnis();
    return (
        <>
            <div className="grid-cols-4 grid">
                {unis && unis.map((e) => (
                    <div key={e.id}>
                        <Unis name={e.name} />
                    </div>
                ))}
            </div>
        </>
    )
}
