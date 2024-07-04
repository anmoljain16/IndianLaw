import Connect from "@/database/connect";
import Crpc from "@/models/crpcModel";
import Bnss from "@/models/bnssModel";

const cleanText = (text) => {
    const stopwords = new Set(["the", "is", "at", "which", "on", "and", "a", "to", "in", "for", "with", "of", "as", "by", "that", "it"]);
    return text
        .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3 && !stopwords.has(word))
        .join(' ');
};

const fetchCrpcData = async (crpcData) => {
    const crpcTitle = cleanText(crpcData.section_title);
    return { crpcWords: crpcTitle.split(' ') };
};

const findBnssMatches = async (crpcWords) => {
    return Bnss.aggregate([
        {
            $addFields: {
                cleanedTitle: { $toLower: { $reduce: {
                            input: {
                                $filter: {
                                    input: { $split: ["$section_title", " "] },
                                    as: "word",
                                    cond: { $gt: [{ $strLenCP: "$$word" }, 3] }
                                }
                            },
                            initialValue: "",
                            in: { $concat: ["$$value", { $cond: [{ $eq: ["$$value", ""] }, "", " "] }, "$$this"] }
                        }}}
            }
        },
        {
            $match: {
                $or: crpcWords.map(word => ({
                    cleanedTitle: { $regex: word, $options: 'i' }
                }))
            }
        },
        {
            $addFields: {
                matchScore: {
                    $reduce: {
                        input: crpcWords,
                        initialValue: 0,
                        in: {
                            $add: [
                                "$$value",
                                {
                                    $cond: [
                                        { $regexMatch: { input: "$cleanedTitle", regex: "$$this", options: "i" } },
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

        const { ipc: data } = await req.json();

        const ipc = data.trim().toUpperCase();

        if (!ipc) {
            return new Response(JSON.stringify({ error: "CRPC section number is required" }), { status: 400 });
        }

        // Fetch the CRPC section
        const crpcData = await Crpc.findOne({ section: ipc });
        if (!crpcData) {
            return new Response(JSON.stringify({ error: "CRPC section not found" }), { status: 404 });
        }

        // Fetch and process CRPC data
        const { crpcWords } = await fetchCrpcData(crpcData);

        // Find BNSS matches
        const bnssMatches = await findBnssMatches(crpcWords);

        if (bnssMatches.length === 0) {
            return new Response(JSON.stringify({
                message: "No matching BNSS sections found",
                isExactMatch: false,
                crpcData
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            crpcData: {
                section: crpcData.section,
                section_title: crpcData.section_title,
                section_desc: crpcData.section_desc
            },
            bnssMatches: bnssMatches.map(match => ({
                section: match.section,
                section_title: match.section_title,
                section_description: match.section_description,
                matchScore: match.matchScore
            })),
            isExactMatch: true
        }), { status: 200 });

    } catch (error) {
        console.error("Error in CRPC to BNSS matching:", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
    }
}
