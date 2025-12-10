import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const CustomInput = ({
    label = "Input Label",
    type = "text",
    value,
    onChange,
    placeholder = "Enter text..."
}) => {
    return (
        <div className="flex flex-col">
            <Label.Root className="text-sm font-medium text-gray-700 mb-1 select-none">
                {label}
            </Label.Root>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full px-4 py-2.5 rounded-xl border border-zinc-200
                    bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20
                "
            />
        </div>
    );
};

export default CustomInput; 