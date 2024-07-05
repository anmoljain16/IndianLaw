import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertTriangle, X} from 'lucide-react';

const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export default function ErrorDisplay({ error, onDismiss }) {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (!error) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        const dismissTimer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(dismissTimer);
        };
    }, [error, onDismiss]);

    useEffect(() => {
        if (error) setTimeLeft(5);
    }, [error]);

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
                <div className="ml-3 flex-shrink-0 flex items-center">
                    <span className="mr-2">{timeLeft}s</span>
                    <button
                        onClick={onDismiss}
                        className="bg-red-200 text-red-700 rounded-full p-1 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Dismiss error"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
