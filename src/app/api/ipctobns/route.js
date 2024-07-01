import IpcModel from "@/models/ipcModel";
import BnsModel from "@/models/bnsModel";
import Connect from "@/database/connect";

// Improved text cleaning function
const cleanText = (text) => {
    const stopwords = new Set(["the", "is", "at", "which", "on", "and", "a", "to", "in", "for", "with", "of", "as", "by", "that", "it"]);
    return text
        .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3 && !stopwords.has(word))
        .join(' ');
};

// Function to fetch and process IPC data
const fetchIpcData = async (ipcData) => {
    const ipcText = cleanText(`${ipcData.sectionTitle} ${ipcData.sectionDescription}`);
    return { ipcWords: ipcText.split(' ') };
};

// Function to find BNS matches
const findBnsMatches = async (ipcWords) => {
    return BnsModel.aggregate([
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
};

export async function POST(req) {
    try {
        await Connect();
        const { ipc } = await req.json();

        const ipcData = await IpcModel.findOne({ sectionNo: ipc });
        if (!ipcData) {
            return new Response(JSON.stringify({ error: "IPC section not found" }), { status: 404 });
        }

        // Fetch and process IPC data
        const { ipcWords } = await fetchIpcData(ipcData);

        // Find BNS matches
        const bnsMatches = await findBnsMatches(ipcWords);

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
        return new Response(JSON.stringify({ error: error.message || "Server error" }), { status: 500 });
    }
}
