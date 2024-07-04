"use client";

import {useCallback, useState} from 'react';
import axios from 'axios';
import {motion} from 'framer-motion';
import {debounce} from 'lodash';

import SearchForm from './SearchForm';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import ComparisonTable from './ComparisonTable';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function IPCtoBNSForm() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (ipc) => {
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const [ipcResponse, crpcResponse] = await Promise.all([
                axios.post('/api/ipctobns', { ipc }),
                axios.post('/api/crpctobnss', { ipc }),
            ]);

            const ipcData = ipcResponse.data;
            const crpcData = crpcResponse.data;
            console.log('ipcData:', ipcData);
            if (ipcData.error) throw new Error(ipcData.error);

            if (!ipcData.bnsMatches || ipcData.bnsMatches.length === 0) {
                throw new Error('No matching BNS section found');
            }

            setResults({
                ipc: ipcData.ipcSection,
                bns: ipcData.bnsMatches[0],
                crpc: crpcData.isExactMatch ? crpcData.crpcData : null,
                bnss: crpcData.isExactMatch ? crpcData.bnssMatches[0] : null,
            });


        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.message || 'Network error occurred. Please try again.');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() !== '') {
            debouncedFetchData(term.trim());
        } else {
            setError('Please enter a valid IPC section');
        }
    };

    const handleDismissError = () => {
        setError('');
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">IPC to BNS Converter</h1>
            <p className="mb-8 text-center text-gray-600">
                Enter an IPC section to get corresponding BNS, CRPC, and BNSS information
            </p>

            <SearchForm onSearch={handleSearch} />

            <ErrorDisplay error={error} onDismiss={handleDismissError} />

            {loading && <LoadingSpinner />}

            {results && (
                <>
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <ComparisonTable
                            ipcData={results.ipc}
                            bnsData={results.bns}
                            crpcData={results.crpc}
                            bnssData={results.bnss}
                        />
                    </motion.div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-8 space-y-4"
                    >
                        <ResultCard title="IPC Section" data={results.ipc} variants={itemVariants}/>
                        <ResultCard title="BNS Section" data={results.bns} variants={itemVariants}/>
                        {results.crpc && (
                            <ResultCard title="CRPC Section" data={results.crpc} variants={itemVariants}/>
                        )}
                        {results.bnss && (
                            <ResultCard title="BNSS Section" data={results.bnss} variants={itemVariants}/>
                        )}
                    </motion.div>


                </>
            )}
        </div>
    );
}
