import Connect from "@/database/connect";
import Crpc from "@/models/crpcModel";
import Bnss from "@/models/bnssModel";

export async function POST(req) {
    try {
        await Connect();

        const { ipc } = await req.json();

        if (!ipc) {
            return new Response(JSON.stringify({ error: "CRPC section number is required" }), { status: 400 });
        }

        // Fetch the CRPC section
        const crpcData = await Crpc.findOne({ section: ipc });

        if (!crpcData) {
            return new Response(JSON.stringify({ error: "CRPC section not found" }), { status: 404 });
        }

        // Fetch matching BNSS sections
        const bnssData = await Bnss.find({ section_title: crpcData.section_title });

        if (bnssData.length === 0) {
            return new Response(JSON.stringify({
                message: "No exact BNSS match found",
                isExactMatch: false,
                crpcData
            }), { status: 200 });
        }

        // If exact match found, return the data
        return new Response(JSON.stringify({
            bnssData: {
                matches: bnssData,

                section_description: crpcData.section_desc
            },
            isExactMatch: true,
            crpcData
        }), { status: 200 });

    } catch (error) {
        console.error("Error in CRPC to BNSS matching:", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
    }
}
