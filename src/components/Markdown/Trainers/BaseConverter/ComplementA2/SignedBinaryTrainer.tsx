import React, { useState } from 'react';
import SignedBinaryTrainerCorrection from './SignedBinaryTrainerCorrection';

function toComplement2(n: number): string {
    const bin = (n >>> 0).toString(2);
    return bin.padStart(8, '0').slice(-8);
}

function fromComplement2(bin: string): number {
    const value = parseInt(bin, 2);
    return bin[0] === '1' ? value - 256 : value;
}

function getRandomInt(bits) {
    return Math.floor(Math.random() * Math.pow(2, bits));
}

export function SignedBinaryTrainer({ bits = 7, isNegative = true }: { bits?: number, isNegative?: boolean }) {
    const [value, setValue] = useState(getRandomInt(bits));
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const bin = (isNegative ? '1' : '0') + value.toString(2).padStart(7, '0');
    const correct = fromComplement2(bin);

    const check = () => {
        if (parseInt(input) === correct) {
            setResult(<div>✅ Bravo, bonne réponse !</div>);
        } else {
            setResult((
                <div>
                    ❌ Oups ! La bonne réponse était {correct}<br />
                    <SignedBinaryTrainerCorrection source={bin} soluce={correct} />
                </div>));
        }
    }

    const reload = () => {
        setValue(getRandomInt(bits));
        setInput('');
        setResult('');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            check();
        }
    };

    return (
        <div className="card margin-bottom--md">
            <div className="card__header">
                Quel entier est codé par : {bin} ?
            </div>
            <div className="card__body">
                <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ta réponse"
                    className="margin-bottom--md"
                    style={{
                        height: '2rem',
                        width: '100%',
                        margin: '0 4px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '0.5rem',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <button className="button button--primary" onClick={check} style={{ flex: '1' }}>Vérifier</button>
                    <button className="button button--secondary" onClick={reload} style={{ flex: '1' }}>Recharger</button>
                </div>
            </div>
            <div className="card__footer">
                {result && <p className="padding-top--sm">{result}</p>}
            </div>
        </div>
    );
};