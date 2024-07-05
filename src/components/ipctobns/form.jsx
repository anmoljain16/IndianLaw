"use client";

import {useCallback, useEffect, useState} from 'react';
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
    const [errors, setErrors] = useState({ ipc: '', crpc: '' });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (ipc) => {
        setLoading(true);
        setErrors({ ipc: '', crpc: '' });
        setResults(null);

        try {
            const [ipcResponse, crpcResponse] = await Promise.allSettled([
                axios.post('/api/ipctobns', { ipc }),
                axios.post('/api/crpctobnss', { ipc }),
            ]);

            let newResults = {};

            if (ipcResponse.status === 'fulfilled') {
                const ipcData = ipcResponse.value.data;
                if (ipcData.error) {
                    setErrors(prev => ({ ...prev, ipc: ipcData.error }));
                } else if (!ipcData.bnsMatches || ipcData.bnsMatches.length === 0) {
                    setErrors(prev => ({ ...prev, ipc: 'No matching BNS section found' }));
                } else {
                    newResults.ipc = ipcData.ipcSection;
                    newResults.bns = ipcData.bnsMatches[0];
                }
            } else {
                setErrors(prev => ({ ...prev, ipc: 'Failed to fetch IPC/BNS data' }));
            }

            if (crpcResponse.status === 'fulfilled') {
                const crpcData = crpcResponse.value.data;
                if (crpcData.isExactMatch) {
                    newResults.crpc = crpcData.crpcData;
                    newResults.bnss = crpcData.bnssMatches[0];
                } else {
                    setErrors(prev => ({ ...prev, crpc: 'No exact match found for CRPC/BNSS' }));
                }
            } else {
                setErrors(prev => ({ ...prev, crpc: 'Failed to fetch CRPC/BNSS data' }));
            }

            if (Object.keys(newResults).length > 0) {
                setResults(newResults);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setErrors({ ipc: 'An unexpected error occurred', crpc: 'An unexpected error occurred' });
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
            setErrors({ ipc: 'Please enter a valid IPC section', crpc: '' });
        }
    };

    const handleDismissError = useCallback((errorType) => {
        setErrors(prev => ({ ...prev, [errorType]: '' }));
    }, []);

    useEffect(() => {
        if (errors.ipc || errors.crpc) {
            const timer = setTimeout(() => {
                setErrors({ ipc: '', crpc: '' });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">IPC to BNS Converter</h1>
            <p className="mb-8 text-center text-gray-600">
                Enter an IPC section to get corresponding BNS, CRPC, and BNSS information
            </p>

            <SearchForm onSearch={handleSearch} />

            {errors.ipc && <ErrorDisplay error={errors.ipc} onDismiss={() => handleDismissError('ipc')} />}
            {errors.crpc && <ErrorDisplay error={errors.crpc} onDismiss={() => handleDismissError('crpc')} />}

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
                        {results.ipc && <ResultCard title="IPC Section" data={results.ipc} variants={itemVariants}/>}
                        {results.bns && <ResultCard title="BNS Section" data={results.bns} variants={itemVariants}/>}
                        {results.crpc && <ResultCard title="CRPC Section" data={results.crpc} variants={itemVariants}/>}
                        {results.bnss && <ResultCard title="BNSS Section" data={results.bnss} variants={itemVariants}/>}
                    </motion.div>
                </>
            )}
        </div>
    );
}
