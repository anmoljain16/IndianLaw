import IpcModel from "@/models/ipcModel";
import BnsModel from "@/models/bnsModel";
import Connect from "@/database/connect";

const cleanText = (text) => text.replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '').toLowerCase();

export async function POST(req) {
    try {
        await Connect();

        const { ipc } = await req.json();

        // Fetch the IPC section
        const ipcData = await IpcModel.findOne({ sectionNo: ipc });

        if (!ipcData) {
            return new Response(JSON.stringify({ error: "IPC section not found" }), { status: 404 });
        }

        // Clean and prepare IPC text for matching
        const ipcText = cleanText(`${ipcData.sectionTitle} ${ipcData.sectionDescription}`);
        const ipcWords = ipcText.split(' ').filter(word => word.length > 3);

        // Find potential BNS matches
        const bnsMatches = await BnsModel.aggregate([
            {
                $addFields: {
                    combinedText: { $concat: ["$sectionTitle", " ", "$sectionDescription"] }
                }
            },
            {
                $match: {
                    $or: ipcWords.map(word => ({
                        combinedText: { $regex: word, $options: 'i' }
                    }))
                }
            },
            {
                $addFields: {
                    matchScore: {
                        $reduce: {
                            input: ipcWords,
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    {
                                        $cond: [
                                            { $regexMatch: { input: "$combinedText", regex: "$$this", options: "i" } },
                                            1,
                                            0
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            { $sort: { matchScore: -1 } },
            { $limit: 5 }
        ]);

        if (bnsMatches.length === 0) {
            return new Response(JSON.stringify({ error: "No matching BNS sections found" }), { status: 404 });
        }

        return new Response(JSON.stringify({
            ipcSection: {
                sectionNo: ipcData.sectionNo,
                sectionTitle: ipcData.sectionTitle,
                sectionDescription: ipcData.sectionDescription
            },
            bnsMatches: bnsMatches.map(match => ({
                sectionNo: match.sectionNo,
                sectionTitle: match.sectionTitle,
                sectionDescription: match.sectionDescription,
                matchScore: match.matchScore
            }))
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
