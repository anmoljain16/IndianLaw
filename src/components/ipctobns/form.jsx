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
    const [errors, setErrors] = useState({ ipc: '', crpc: '', iea: '' });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (ipc) => {
        setLoading(true);
        setErrors({ ipc: '', crpc: '', iea: '' });
        setResults(null);

        try {
            const [ipcResponse, crpcResponse, ieaResponse] = await Promise.allSettled([
                axios.post('/api/ipctobns', { ipc }),
                axios.post('/api/crpctobnss', { ipc }),
                axios.post('/api/ieatobsa', { iea: ipc }), // Using IPC as IEA for simplicity
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
                setErrors(prev => ({ ...prev, ipc: 'IPC/BNS data not found' }));
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
                setErrors(prev => ({ ...prev, crpc: 'CRPC/BNSS data not found' }));
            }

            if (ieaResponse.status === 'fulfilled') {
                const ieaData = ieaResponse.value.data;
                if (ieaData.isExactMatch) {
                    newResults.iea = ieaData.ieaData;
                    newResults.bsa = ieaData.bsaMatches[0];
                } else {
                    setErrors(prev => ({ ...prev, iea: 'No exact match found for IEA/BSA' }));
                }
            } else {
                setErrors(prev => ({ ...prev, iea: 'IEA/BSA data not found' }));
            }

            if (Object.keys(newResults).length > 0) {
                setResults(newResults);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setErrors({ ipc: 'An unexpected error occurred', crpc: 'An unexpected error occurred', iea: 'An unexpected error occurred' });
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
            setErrors({ ipc: 'Please enter a valid section number', crpc: '', iea: '' });
        }
    };

    const handleDismissError = useCallback((errorType) => {
        setErrors(prev => ({ ...prev, [errorType]: '' }));
    }, []);

    useEffect(() => {
        if (errors.ipc || errors.crpc || errors.iea) {
            const timer = setTimeout(() => {
                setErrors({ ipc: '', crpc: '', iea: '' });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Law Section Converter</h1>
            <p className="mb-8 text-center text-gray-600">
                Enter a section number to get corresponding information for IPC/BNS, CRPC/BNSS, and IEA/BSA
            </p>

            <SearchForm onSearch={handleSearch} />

            {errors.ipc && <ErrorDisplay error={errors.ipc} onDismiss={() => handleDismissError('ipc')} />}
            {errors.crpc && <ErrorDisplay error={errors.crpc} onDismiss={() => handleDismissError('crpc')} />}
            {errors.iea && <ErrorDisplay error={errors.iea} onDismiss={() => handleDismissError('iea')} />}

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
                            ieaData={results.iea}
                            bsaData={results.bsa}
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
                        {results.iea && <ResultCard title="IEA Section" data={results.iea} variants={itemVariants}/>}
                        {results.bsa && <ResultCard title="BSA Section" data={results.bsa} variants={itemVariants}/>}
                    </motion.div>
                </>
            )}
        </div>
    );
}
