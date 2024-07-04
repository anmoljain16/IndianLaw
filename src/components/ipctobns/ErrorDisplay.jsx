import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertTriangle} from 'lucide-react';

const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export default function ErrorDisplay({ error, onDismiss }) {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                variants={errorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm flex items-start"
                role="alert"
            >
                <AlertTriangle className="mr-3 flex-shrink-0" />
                <div className="flex-grow">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="ml-auto bg-red-200 text-red-700 rounded-full p-1 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Dismiss error"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
