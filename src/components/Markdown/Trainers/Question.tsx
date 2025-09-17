import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Equation } from 'react-equation'

type Choice = {
    label: string;
    isCorrect: boolean;
    isEquation?: boolean;
};

type QuestionProps = {
    question: string;
    choices: Choice[];
    explanation: string;
};

export const Question: React.FC<QuestionProps> = ({ question, choices, explanation }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const launchConfetti = () => {
        const duration = 1000;
        const end = Date.now() + duration;

        const colors = ['#00c851', '#007E33'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };


    const handleClick = (index: number) => {
        if (selectedIndex === null) {
            setSelectedIndex(index);
            if (choices[index].isCorrect) {
                launchConfetti();
            }
        }
    };

    return (
        <div className="question-container">
            <p className="question-title">{question}</p>
            <div className="question-choices">
                {choices.map((choice, index) => {
                    const isSelected = selectedIndex === index;
                    const isCorrect = choice.isCorrect;

                    let buttonClass = 'question-button';
                    if (selectedIndex !== null) {
                        buttonClass += ' disabled';
                        if (isSelected && isCorrect) {
                            buttonClass += ' correct';
                        } else if (isSelected && !isCorrect) {
                            buttonClass += ' wrong';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleClick(index)}
                            className={buttonClass}
                            disabled={selectedIndex !== null}
                        >
                            {choice.isEquation ? 
                            <Equation
                                value={choice.label}
                            />
                            : choice.label}
                        </button>
                    );
                })}
            </div>

            {selectedIndex !== null && (
                <div className="question-explanation">
                    <strong>Explication :</strong> {explanation}
                </div>
            )}
        </div>
    );
};