import React, { useState } from 'react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { Equation } from 'react-equation';
import styles from './Question.module.css';

type Choice = {
    label: string;
    isCorrect: boolean;
    isEquation?: boolean;
};

export type QuestionTheme = 'serieux' | 'ludique';

type QuestionProps = {
    question: string;
    choices: Choice[];
    explanation: string;
    /** Thème visuel : « serieux » (sobre) ou « ludique » (coloré, animé, confettis). Par défaut : « ludique ». */
    theme?: QuestionTheme;
    /** Mélange l'ordre des réponses à chaque nouvelle tentative. Par défaut : true. */
    shuffleOnRetry?: boolean;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SUCCESS_MESSAGES = ['Bravo ! 🎉', 'Excellent ! 🚀', 'Bien joué ! 🌟', 'Parfait ! 🏆', 'Génial ! 🤩'];
const FAIL_MESSAGES = [
    'Raté… mais tu peux réessayer ! 💪',
    'Pas tout à fait… retente ta chance ! 🎲',
    'Oups ! Encore un essai ? 🙃',
    'Presque ! Ne lâche rien ! 🔥',
];

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const shuffle = (indices: number[]) => {
    const result = [...indices];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const launchConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#00c851', '#007E33', '#ffbb33', '#33b5e5'];

    (function frame() {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
};

export const Question: React.FC<QuestionProps> = ({
    question,
    choices,
    explanation,
    theme = 'ludique',
    shuffleOnRetry = true,
}) => {
    const isFun = theme === 'ludique';

    // Ordre d'affichage (identité au premier rendu pour rester compatible avec le rendu serveur).
    const [order, setOrder] = useState<number[]>(() => choices.map((_, i) => i));
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [successes, setSuccesses] = useState(0);
    const [message, setMessage] = useState('');
    // Change à chaque tentative pour rejouer les animations.
    const [round, setRound] = useState(0);

    const answered = selectedIndex !== null;
    const isRight = answered && choices[selectedIndex].isCorrect;

    const handleClick = (index: number) => {
        if (answered) return;
        const correct = choices[index].isCorrect;
        setSelectedIndex(index);
        setAttempts((a) => a + 1);
        if (correct) {
            setSuccesses((s) => s + 1);
            if (isFun) launchConfetti();
        }
        setMessage(
            isFun
                ? pick(correct ? SUCCESS_MESSAGES : FAIL_MESSAGES)
                : correct
                  ? 'Bonne réponse.'
                  : 'Réponse incorrecte.'
        );
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setRevealed(false);
        setMessage('');
        setRound((r) => r + 1);
        if (shuffleOnRetry && choices.length > 1) {
            setOrder((current) => shuffle(current));
        }
    };

    const showExplanation = isRight || revealed;

    return (
        <div className={clsx(styles.container, isFun ? styles.ludique : styles.serieux)}>
            <div className={styles.header}>
                <p className={styles.title}>
                    {isFun && <span className={styles.titleIcon} aria-hidden>❓</span>}
                    {question}
                </p>
                {attempts > 0 && (
                    <span className={styles.score} title="Bonnes réponses / tentatives">
                        {isFun ? '⭐ ' : ''}
                        {successes} / {attempts}
                    </span>
                )}
            </div>

            <div className={styles.choices} key={round}>
                {order.map((choiceIndex, position) => {
                    const choice = choices[choiceIndex];
                    const isSelected = selectedIndex === choiceIndex;
                    const revealCorrect = revealed && choice.isCorrect;

                    return (
                        <button
                            key={choiceIndex}
                            type="button"
                            onClick={() => handleClick(choiceIndex)}
                            disabled={answered}
                            style={isFun ? { animationDelay: `${position * 60}ms` } : undefined}
                            className={clsx(
                                styles.button,
                                answered && styles.disabled,
                                isSelected && choice.isCorrect && styles.correct,
                                isSelected && !choice.isCorrect && styles.wrong,
                                revealCorrect && !isSelected && styles.revealed
                            )}
                        >
                            <span className={styles.letter} aria-hidden>
                                {LETTERS[position] ?? position + 1}
                            </span>
                            <span className={styles.label}>
                                {choice.isEquation ? <Equation value={choice.label} /> : choice.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {answered && (
                <div
                    className={clsx(styles.feedback, isRight ? styles.feedbackOk : styles.feedbackKo)}
                    role="status"
                >
                    <span className={styles.message}>{message}</span>
                    <div className={styles.actions}>
                        {!isRight && !revealed && (
                            <button
                                type="button"
                                className={clsx(styles.action, styles.actionSecondary)}
                                onClick={() => setRevealed(true)}
                            >
                                {isFun ? '👀 Voir la réponse' : 'Afficher la réponse'}
                            </button>
                        )}
                        <button type="button" className={styles.action} onClick={handleRetry}>
                            {isRight ? (isFun ? '🔁 Rejouer' : 'Recommencer') : isFun ? '🎯 Réessayer' : 'Réessayer'}
                        </button>
                    </div>
                </div>
            )}

            {showExplanation && (
                <div className={styles.explanation}>
                    <strong>{isFun ? '💡 Explication :' : 'Explication :'}</strong> {explanation}
                </div>
            )}
        </div>
    );
};

export default Question;
