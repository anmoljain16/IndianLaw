import React from 'react';

const ComparisonTable = ({ ipcData, bnsData, crpcData, bnssData, ieaData, bsaData }) => {
    return (
        <div className="mt-8 overflow-x-auto ">
            <table className="min-w-full mb-4 bg-white border border-gray-300">
                <thead>
                <tr   className="bg-gray-100">
                    {/*<th className="py-2 px-4 border-b">Aspect</th>*/}
                    <th className="py-2 px-4 border-b">IPC</th>
                    <th className="py-2 px-4 border-b">BNS</th>

                </tr>
                </thead>
                <tbody>
                <tr align={"center"} >
                    {/*<td className="py-2 px-4 border-b font-semibold">Section</td>*/}
                    <td className="py-2 px-4 border-b">{ipcData?.sectionNo || '-'}</td>
                    <td className="py-2 px-4 border-b">{bnsData?.sectionNo || '-'}</td>

                </tr>
                {/*<tr>*/}
                {/*    <td className="py-2 px-4 border-b font-semibold">Title</td>*/}
                {/*    <td className="py-2 px-4 border-b">{ipcData?.sectionTitle || '-'}</td>*/}
                {/*    <td className="py-2 px-4 border-b">{bnsData?.sectionTitle || '-'}</td>*/}

                {/*</tr>*/}

                </tbody>
            </table>

            {crpcData && (
                <table className="min-w-full mb-4 bg-white border border-gray-300">
                    <thead>
                    <tr  className="bg-gray-100">
                        <th className="py-2 px-4 border-b">CRPC</th>
                        <th className="py-2 px-4 border-b">BNSS</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr align={"center"}>
                        <td className="py-2 px-4 border-b">{crpcData?.section || '-'}</td>
                        <td className="py-2 px-4 border-b">{bnssData?.section || '-'}</td>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td className="py-2 px-4 border-b font-semibold">Title</td>*/}

                    {/*    <td className="py-2 px-4 border-b">{crpcData?.section_title || '-'}</td>*/}
                    {/*    <td className="py-2 px-4 border-b">{bnssData?.section_title || '-'}</td>*/}
                    {/*</tr>*/}

                    </tbody>
                </table>)}

            {ieaData && (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr   className="bg-gray-100 ">
                        {/*<th className="py-2 px-4 border-b">Aspect</th>*/}
                        <th className="py-2 px-4 border-b">IEA</th>
                        <th className="py-2 px-4 border-b">BSA</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr align={"center"} >
                        {/*<td className="py-2 px-4 border-b font-semibold justify-self-center">Section</td>*/}
                        <td className="py-2 px-4 border-b">{ieaData?.section || '-'}</td>
                        <td className="py-2 px-4 border-b">{bsaData?.section || '-'}</td>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td className="py-2 px-4 border-b font-semibold">Title</td>*/}
                    {/*    <td className="py-2 px-4 border-b">{ieaData?.section_title || '-'}</td>*/}
                    {/*    <td className="py-2 px-4 border-b">{bsaData?.section_title || '-'}</td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ComparisonTable;
