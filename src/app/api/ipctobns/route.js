import IpcModel from "@/models/ipcModel";
import Connect from "@/database/connect";
import leven from 'leven';
import BnsModel from "@/models/bnsModel";

export async function POST(req) {
    try {
        await Connect();

        const ipc = await req.json();
        const ipcData = await IpcModel.findOne({ sectionNo: ipc.ipc });

        if (!ipcData) {
            return new Response(JSON.stringify({ error: "IPC section not found" }), { status: 404 });
        }

        // Clean the IPC section title and description for comparison
        const ipcText = (ipcData.sectionTitle + ' ' + ipcData.sectionDescription)
            .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
            .toLowerCase();

        const bnsData = await BnsModel.find();

        let closestMatch = null;
        let smallestDistance = Infinity;

        bnsData.forEach(bnsSection => {
            // Clean the BNS section title and description for comparison
            const bnsText = (bnsSection.sectionTitle + ' ' + bnsSection.sectionDescription)
                .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
                .toLowerCase();

            // Calculate the Levenshtein distance
            const distance = leven(ipcText, bnsText);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestMatch = bnsSection;
            }
        });

        if (closestMatch) {
            return new Response(JSON.stringify({ ipcData, closestMatch }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "No matching BNS section found" }), { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
