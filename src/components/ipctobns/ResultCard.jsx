import React, {useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronDown} from 'lucide-react';

export default function ResultCard({ title, data, variants }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <motion.div
            variants={variants}
            className="bg-white shadow-md rounded-lg overflow-hidden"
        >
            <motion.button
                onClick={toggleAccordion}
                className="w-full px-4 py-3 bg-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ backgroundColor: "#e5e7eb" }}
                whileTap={{ scale: 0.98 }}
            >
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </motion.button>
            <AnimatePresence initial={false}>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{
                        height: isOpen ? contentRef.current?.scrollHeight || "auto" : 0,
                        transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
                    }}
                    exit={{
                        height: 0,
                        transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
                    }}
                    className="overflow-hidden"
                >
                    <div ref={contentRef} className="p-4 bg-white">
                        <p><span className="font-semibold">Section Number:</span> {data.sectionNo || data.section}</p>
                        <p><span className="font-semibold">Title:</span> {data.sectionTitle || data.section_title}</p>
                        <p><span className="font-semibold">Description:</span> {data.sectionDescription || data.section_desc}</p>
                    {/*    a button for translating sectiondescription into hindi*/}

                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
