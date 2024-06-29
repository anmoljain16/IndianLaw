
import Connect from "@/database/connect";
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        // Resolve the path to the IPC JSON file
        const ipcFilePath = path.resolve(process.cwd(), "C:/NextJs/indianlaw/src/app/api/hello/CRPC.json");
        const ipcData = JSON.parse(await fs.readFile(ipcFilePath, "utf-8"));
        console.log("IPC data read successfully");

        await Connect();

        // Arrays to store results
        const successfullySaved = [];
        const failedToSave = [];

        // Insert data into the database
        await Promise.all(ipcData.map(async (section) => {
            try {
                // console.log(section)
                const sectionNo = section.section || '';
                const subSectionTitle = section.subSectionTitle || '';
                const sectionTitle = section.sectionTitle || '';
                const sectionDesc = section.sectionDesc || section.subSectionDesc || '';

                const combinedData = (sectionTitle + " " + sectionDesc + " " + subSectionTitle)
                    .replace(/[^\w\s]|[\n\r]|\(\w+\)/g, '')
                    .toLowerCase()

                successfullySaved.push({
                    sectionNo: sectionNo,
                    subsectionTitle: subSectionTitle,
                    sectionTitle: sectionTitle,
                    sectionDescription: sectionDesc,
                    combinedData: combinedData
                });

                // const result = await BnsModel.create({
                //     sectionNo: sectionNo,
                //     subsectionTitle: subSectionTitle,
                //     sectionTitle: sectionTitle,
                //     sectionDescription: sectionDesc,
                //     combinedData: combinedData
                // });

                // successfullySaved.push({ id: result._id, sectionNo: result.sectionNo });

                // Uncomment and modify this line as per your database model to save the data
                // const result = await IpcModel.create(section);
                // successfullySaved.push({ id: result._id, sectionNo: section.sectionNo });

            } catch (error) {
                console.error(`Error saving section ${section.sectionNo}:`, error);
                failedToSave.push({ sectionNo: section.sectionNo, error: error.message });
            }
        }));

        // Return a success response
        return new Response(JSON.stringify({
            message: "Data processing completed",
            successfullySaved,
            failedToSave
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process data" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
