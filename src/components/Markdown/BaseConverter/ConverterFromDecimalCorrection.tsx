import React from "react";
import { BlockMath } from "react-katex";

interface ConverterFromDecimalCorrectionProps {
    base: '2' | '10' | '16';
    source: string;
    soluce: string;
}

const ConverterFromDecimalCorrection: React.FC<ConverterFromDecimalCorrectionProps> = ({ base, source, soluce }) => {
    const generateLatex = (source: string) => {
        if (base === '2') {
            let number = parseInt(source, 10);
            let steps = [];
            while (number > 0) {
            steps.push(`${number} \\div 2 &= ${Math.floor(number / 2)} \\text{ reste } \\textcolor{red}{${number % 2}}`);
            number = Math.floor(number / 2);
            }
            return `\\begin{aligned}${steps.join(' \\\\ ')}\\end{aligned}`;
        } else if (base === '16') {
            let number = parseInt(source, 10);
            let steps = [];
            while (number > 0) {
            const remainder = number % 16;
            const hexDigit = remainder.toString(16).toUpperCase();
            steps.push(`${number} \\div 16 = ${Math.floor(number / 16)} \\text{ reste } \\textcolor{red}{${hexDigit}}`);
            number = Math.floor(number / 16);
            }
            return `\\begin{aligned}${steps.join(' \\\\ ')}\\end{aligned}`;
        }
        return '';
      };
    
      return <BlockMath math={generateLatex(source)} />;
};

export default ConverterFromDecimalCorrection;