import React, { useState } from 'react';

const bases = ['binaire', 'décimale', 'hexadécimale'];
const getRandomInt = () => Math.floor(Math.random() * 256); // 0 à 255

function toBase(n: number, base: string): string[] {
  if (base === 'binaire') return [n.toString(2), '2'];
  if (base === 'hexadécimale') return [n.toString(16).toUpperCase(), '16'];
  return [n.toString(10), '10'];
}

export function ConvertTrainer ({ fromBase, toBaseChoice }: { fromBase: string, toBaseChoice: string }) {
  const [value, setValue] = useState(getRandomInt());
  const [answer, setAnswer] = useState<string[]>([]);
  const [result, setResult] = useState('');

  const [correctValue, baseNumber] = toBase(value, toBaseChoice);
  const [displayValue, baseDisplay] = toBase(value, fromBase);

  const check = () => {
    const userAnswer = answer.join('').trim().toLowerCase();
    if (userAnswer === correctValue.toLowerCase()) {
      setResult('✅ Bravo, bonne réponse !');
    } else {
      setResult(`❌ Oups ! La bonne réponse était ${correctValue}₍${baseNumber}₎`);
    }
  };

  const reload = () => {
    setValue(getRandomInt());
    setAnswer([]);
    setResult('');
  };

  const handleInputChange = (index: number, char: string) => {
    const newAnswer = [...answer];
    newAnswer[index] = char;
    setAnswer(newAnswer);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <p>
        <strong>
          Convertis {displayValue}<sub>{baseDisplay}</sub> de la base {fromBase} vers la base {toBaseChoice}
        </strong>
      </p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {Array.from({ length: correctValue.length }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={answer[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            style={{ width: '20px', textAlign: 'center' }}
          />
        ))}
      </div>
      <button onClick={check} style={{ marginRight: '8px' }}>Vérifier</button>
      <button onClick={reload}>Recharger</button>
      <p>{result}</p>
    </div>
  );
}