import React, { ReactNode } from 'react';

export default function Highlight ({ children, color }: {children: ReactNode, color: string}) {
    const highlightColors = {
        yellow: 'var(--highlight-color-yellow)',
        orange: 'var(--highlight-color-orange)',
        red: 'var(--highlight-color-red)',
        green: 'var(--highlight-color-green)',
        blue: 'var(--highlight-color-blue)',
    };

    const selectedColor = highlightColors[color] || color;

    return ( 
        <span
            style={{
                background: `linear-gradient(180deg, transparent 60%, ${selectedColor} 60%)`, 
            }}
        >
            {children}
        </span>
    )
};