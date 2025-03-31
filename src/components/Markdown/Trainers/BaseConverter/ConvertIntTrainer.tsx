import React, { useState } from 'react';
import ConverterToDecimalCorrection from './ConverterToDecimalCorrection';
import ConverterFromDecimalCorrection from './ConverterFromDecimalCorrection';
import OtpInput from 'react-otp-input';

const bases = ['binaire', 'décimale', 'hexadécimale'];
const getRandomInt = () => Math.floor(Math.random() * 256); // 0 à 255

function toBase(n: number, base: string): string[] {
  if (base === 'binaire') return [n.toString(2), '2'];
  if (base === 'hexadécimale') return [n.toString(16).toUpperCase(), '16'];
  return [n.toString(10), '10'];
}

export function ConvertIntTrainer({ fromBase, toBaseChoice }: { fromBase: string, toBaseChoice: string }) {
  const [value, setValue] = useState(getRandomInt());
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);

  const [correctValue, baseNumber] = toBase(value, toBaseChoice);
  const [displayValue, baseDisplay] = toBase(value, fromBase);

  const check = () => {
    const userAnswer = answer.trim().toLowerCase();
    if (userAnswer === correctValue.toLowerCase()) {
      setResult(<div>✅ Bravo, bonne réponse !</div>);
    } else {
      setResult((
        <div>
          ❌ Oups ! La bonne réponse était {correctValue}<br />
          {toBaseChoice === 'décimale' && <ConverterToDecimalCorrection base={baseDisplay} source={displayValue} soluce={correctValue} />}
          {fromBase === 'décimale' && <ConverterFromDecimalCorrection base={baseNumber} source={displayValue} soluce={correctValue} />}
        </div>));
    }
  };

  const reload = () => {
    setValue(getRandomInt());
    setAnswer('');
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
        Convertis {displayValue}<sub>{baseDisplay}</sub> vers la base {toBaseChoice}
      </div>
      <div className="card__body margin-bottom--md">
        <OtpInput
          renderInput={(props) => <input {...props} onKeyDown={handleKeyDown} />}
          renderSeparator={''}
          value={answer}
          onChange={setAnswer}
          numInputs={correctValue.length}
          inputStyle={{
            width: '1.5rem',
            height: '1.5rem',
            textAlign: 'center',
            margin: '0 4px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>
      <div className="card__footer">
        <button className="button button--primary" onClick={check} style={{ marginRight: '8px' }}>Vérifier</button>
        <button className="button button--secondary" onClick={reload}>Recharger</button>
      </div>
      {result && <p className="padding-top--sm">{result}</p>}
    </div>
  );
}
