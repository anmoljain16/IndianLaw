import Connect from "@/database/connect";
import Iea from "@/models/ieaModel";
import Bsa from "@/models/bsaModel";

const cleanText = (text) => {
    const stopwords = new Set(["the", "is", "at", "which", "on", "and", "a", "to", "in", "for", "with", "of", "as", "by", "that", "it"]);
    return text
        .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3 && !stopwords.has(word))
        .join(' ');
};

const fetchIeaData = async (ieaData) => {
    const ieaTitle = cleanText(ieaData.section_title);
    return { ieaWords: ieaTitle.split(' ') };
};

const findBsaMatches = async (ieaWords) => {
    return Bsa.aggregate([
        {
            $addFields: {
                cleanedTitle: {
                    $toLower: {
                        $reduce: {
                            input: {
                                $filter: {
                                    input: { $split: ["$section_title", " "] },
                                    as: "word",
                                    cond: { $gt: [{ $strLenCP: "$$word" }, 3] }
                                }
                            },
                            initialValue: "",
                            in: { $concat: ["$$value", { $cond: [{ $eq: ["$$value", ""] }, "", " "] }, "$$this"] }
                        }
                    }
                }
            }
        },
        {
            $match: {
                $or: ieaWords.map(word => ({
                    cleanedTitle: { $regex: word, $options: 'i' }
                }))
            }
        },
        {
            $addFields: {
                matchScore: {
                    $reduce: {
                        input: ieaWords,
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

        const { iea: data } = await req.json();

        const iea = data.trim().toUpperCase();

        if (!iea) {
            return new Response(JSON.stringify({ error: "IEA section number is required" }), { status: 400 });
        }

        // Fetch the IEA section
        const ieaData = await Iea.findOne({ section: iea });
        if (!ieaData) {
            return new Response(JSON.stringify({ error: "IEA section not found" }), { status: 404 });
        }

        // Fetch and process IEA data
        const { ieaWords } = await fetchIeaData(ieaData);

        // Find BSA matches
        const bsaMatches = await findBsaMatches(ieaWords);

        if (bsaMatches.length === 0) {
            return new Response(JSON.stringify({
                message: "No matching BSA sections found",
                isExactMatch: false,
                ieaData
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            ieaData: {
                section: ieaData.section,
                section_title: ieaData.section_title,
                section_desc: ieaData.section_desc
            },
            bsaMatches: bsaMatches.map(match => ({
                section: match.section,
                section_title: match.section_title,
                section_description: match.section_desc,
                matchScore: match.matchScore
            })),
            isExactMatch: true
        }), { status: 200 });

    } catch (error) {
        console.error("Error in IEA to BSA matching:", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
    }
}
