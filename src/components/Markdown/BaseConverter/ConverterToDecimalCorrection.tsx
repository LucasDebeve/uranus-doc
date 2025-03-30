import React from "react";
import { BlockMath } from "react-katex";

interface ConverterToDecimalCorrectionProps {
    base: '2' | '10' | '16';
    source: string;
    soluce: string;
}

const ConverterToDecimalCorrection: React.FC<ConverterToDecimalCorrectionProps> = ({ base, source, soluce }) => {
    const generateLatex = (source: string) => {
        const hexaLettersToNumber = {
            "A": 10,
            "B": 11,
            "C": 12,
            "D": 13,
            "E": 14,
            "F": 15,
        }
        const sourceSplit = source.split("");
        // replace hexadecimal letters with their corresponding decimal values
        for (let i = 0; i < sourceSplit.length; i++) {
            if (sourceSplit[i] in hexaLettersToNumber) {
                sourceSplit[i] = hexaLettersToNumber[sourceSplit[i]];
            }
        }

        const terms = sourceSplit
          .reverse()
          .map((bit, index) => `\\textcolor{red}{${bit}} \\times ${base}^{${index}}`)
          .reverse();
    
        return `\\begin{aligned} &= ${terms.join(" + ")} \\\\ &= ${soluce}_{10} \\end{aligned}`;
      };
    
      return <BlockMath math={generateLatex(source)} />;
};

export default ConverterToDecimalCorrection;