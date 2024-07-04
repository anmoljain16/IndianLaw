import React, {useState} from 'react';
import {motion} from 'framer-motion';

export default function SearchForm({ onSearch }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(input);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex items-center border-b border-gray-300 py-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter IPC section (e.g., 300, 304, 376)"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="IPC Section"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="submit"
                >
                    Search
                </motion.button>
            </div>
        </form>
    );
}
