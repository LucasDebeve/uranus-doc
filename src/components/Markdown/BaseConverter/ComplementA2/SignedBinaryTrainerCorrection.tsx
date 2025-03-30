import React from "react";
import { BlockMath } from "react-katex";

interface SignedBinaryTrainerCorrectionProps {
    source: string;
    soluce: string;
}

const SignedBinaryTrainerCorrection: React.FC<SignedBinaryTrainerCorrectionProps> = ({ source, soluce }) => {
    const generateLatex = (source: string) => {
        let latex = `\\begin{aligned} &: ${source}_{2} \\\\`; 
        if (source[0] === '1') {
            // invert bits
            let invertedBits = source.split("").map(bit => bit === '1' ? '0' : '1').join("");
            latex += `\\text{Inverse} &: \\textcolor{red}{${invertedBits}}_{2} \\\\`;
            // add 1 to invertedBits
            const invertedNumberPlusOne = parseInt(invertedBits, 2) + 1;
            const invertedBitsPlusOne = invertedNumberPlusOne.toString(2).padStart(8, '0');
            latex += `\\text{+ 1} &= ${invertedBitsPlusOne}_{2} \\\\`;
            latex += `${invertedBitsPlusOne}_{2} &= ${-soluce}_{10} \\\\`;
        }
        return latex + `${source}_{2} &= ${soluce}_{10} \\end{aligned}`;
      };
    
      return <BlockMath math={generateLatex(source)} />;
};

export default SignedBinaryTrainerCorrection;