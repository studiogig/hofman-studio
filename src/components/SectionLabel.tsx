import React from 'react';

interface SectionLabelProps {
    text: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ text }) => {
    return (
        <div className="flex items-center mb-8 md:mb-12">
            <span className="text-accent mr-3">●</span>
            <span className="text-label">{text}</span>
        </div>
    );
};
