"use client";

import { useState } from "react";
import axios from "axios";

export default function Ipctobns() {
    const [ipc, setIpc] = useState("");
    const[ipcData, setIpcData] = useState(null);
    const [bns, setBns] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ipc) {
            setError("Please enter the IPC section");
            return;
        }

        setLoading(true);
        setError("");
        setBns(null);

        try {
            const { data } = await axios.post("/api/ipctobns", { ipc });

            if(data.error){
                setError(data.error);
                return;
            }

            console.log(data);
            setBns(data.closestMatch);
            setIpcData(data.ipcData)

        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">IPC to BNS</h1>
            <p className="mb-4">Enter the IPC section to get the corresponding BNS section</p>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label htmlFor="ipc" className="block text-sm font-medium text-gray-700">IPC Section:</label>
                    <input
                        type="text"
                        id="ipc"
                        name="ipc"
                        onChange={(e) => setIpc(e.target.value)}
                        value={ipc}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {/*create a table for showing ipc section and bns section */}

            {bns && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">Comparison between IPC and BNS</h2>
                    {/*<p><span className="font-semibold">{bns.sectionTitle} :</span> {bns.sectionDescription}</p>*/}
                    {/*<hr className="my-4" />*/}
                    <table className="table-auto m-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">IPC Section </th>
                            <th className="px-4 py-2">BNS Section </th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border px-4 py-2">{ipcData.sectionNo}</td>
                            <td className="border px-4 py-2">{bns.sectionNo}</td>

                        </tr>
                        <tr>
                            <td className="border px-4 py-2">{ipcData.sectionTitle}</td>
                            <td className="border px-4 py-2">{bns.sectionTitle}</td>

                        </tr>
                        <tr>
                            <td className="border px-4 py-2">{ipcData.sectionDescription}</td>
                            <td className="border px-4 py-2">{bns.sectionDescription}</td>

                        </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {bns && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">Corresponding BNS Section</h2>
                    {/*<p><span className="font-semibold">{bns.sectionTitle} :</span> {bns.sectionDescription}</p>*/}
                    {/*<hr className="my-4" />*/}


                    <p><span className="font-semibold">BNS Section Number:</span> {bns.sectionNo}</p>
                    <p><span className="font-semibold">Section Title:</span> {bns.sectionTitle}</p>
                    <p><span className="font-semibold">Section Description:</span> {bns.sectionDescription}</p>
                </div>
            )}
            {ipcData && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">IPC Section Details</h2>
                    <p><span className="font-semibold">IPC Section Number:</span> {ipcData.sectionNo}</p>
                    <p><span className="font-semibold">Section Title:</span> {ipcData.sectionTitle}</p>
                    <p><span className="font-semibold">Section Description:</span> {ipcData.sectionDescription}</p>
                </div>
            )}
        </div>
    );
}
