import React from 'react';

type OTPInputProps = {
    index: number;
    answer: string[];
    handleInputChange: (index: number, char: string) => void;
};

function OTPInput({index, answer, handleInputChange}) {
    return (
        <input
            key={index}
            type="text"
            maxLength={1}
            value={answer[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{ width: '20px', textAlign: 'center' }}
          />
    );
}

export default OTPInput;