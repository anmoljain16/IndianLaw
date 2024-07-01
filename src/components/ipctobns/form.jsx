"use client";

import {useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export default function Ipctobns() {
    const [ipc, setIpc] = useState("");
    const [ipcData, setIpcData] = useState(null);
    const [bns, setBns] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [crpcData, setCrpcData] = useState(null);
    const [bnss, setBnss] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ipc.trim() === "") {
            setError("Please enter the IPC section");
            return;
        }

        setLoading(true);
        setError("");
        setBns(null);
        setIpcData(null);
        setCrpcData(null);
        setBnss(null);

        try {
            const response = await axios.post("/api/ipctobns", { ipc: ipc.trim() });

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            const data = response.data;

            setBns(data.bnsMatches[0]);
            setIpcData(data.ipcSection);

            const { data: bnssData } = await axios.post("/api/crpctobnss", { ipc });
            if (!bnssData.isExactMatch) {
                return;
            }

            setCrpcData(bnssData.crpcData);
            setBnss(bnssData.bnssData.matches[0]);

        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An unexpected error occurred");
            }
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
                        placeholder="Enter IPC section Eg: 300, 304, 376 etc."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <motion.button
                    initial={{ opacity: 0.6 }}
                    whileTap={{ scale: 0.9 }}
                    whileInView={{ opacity: 1 }}
                >
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </motion.button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {bns && (
                <motion.div
                    className="box"
                    variants={container}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                        <table className="table-auto ">
                            <thead>
                            <tr>
                                <th className="px-4 py-2">IPC Section</th>
                                <th className="px-4 py-2">BNS Section</th>
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
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
            {crpcData && (
                <motion.div
                    className="box"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                        <table className="table-auto ">
                            <thead>
                            <tr>
                                <th className="px-4 py-2">CRPC Section</th>
                                <th className="px-4 py-2">BNSS Section</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border px-4 py-2">{crpcData.section}</td>
                                <td className="border px-4 py-2">{bnss.section}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">{crpcData.section_title}</td>
                                <td className="border px-4 py-2">{bnss.section_title}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
            {bns && (
                <motion.div
                    className="box"
                    variants={container}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">Corresponding BNS Section</h2>
                        <p><span className="font-semibold">BNS Section Number:</span> {bns.sectionNo}</p>
                        <p><span className="font-semibold">Section Title:</span> {bns.sectionTitle}</p>
                        <p><span className="font-semibold">Section Description:</span> {bns.sectionDescription}</p>
                    </div>
                </motion.div>
            )}
            {ipcData && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">IPC Section Details</h2>
                    <p><span className="font-semibold">IPC Section Number:</span> {ipcData.sectionNo}</p>
                    <p><span className="font-semibold">Section Title:</span> {ipcData.sectionTitle}</p>
                    <p><span className="font-semibold">Section Description:</span> {ipcData.sectionDescription}</p>
                </div>
            )}
            {bnss && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">BNSS Section Details</h2>
                    <p><span className="font-semibold">BNSS Section Number:</span> {bnss.section}</p>
                    <p><span className="font-semibold">Section Title:</span> {bnss.section_title}</p>
                    <p><span className="font-semibold">Section Description:</span> {crpcData.section_desc}</p>
                </div>
            )}
            {crpcData && (
                <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">CRPC Section Details</h2>
                    <p><span className="font-semibold">CRPC Section Number:</span> {crpcData.section}</p>
                    <p><span className="font-semibold">Section Title:</span> {crpcData.section_title}</p>
                    <p><span className="font-semibold">Section Description:</span> {crpcData.section_desc}</p>
                </div>
            )}
        </div>
    );
}
