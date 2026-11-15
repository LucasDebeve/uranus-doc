import React, {useId, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {trainerStyles as s} from './core/Entraineur';
import {ENCODINGS, decodeLatin1, decodeUtf8, encodeText, hex, unencodable, type EncodingId} from './core/encodage';
import t from './ConvertisseurTexte.module.css';

function download(bytes: number[], name: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], {type: 'text/plain'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Outil (pas un exercice) : voir les octets d'un texte dans plusieurs encodages,
 * simuler une mauvaise lecture, et enregistrer / relire un vrai fichier dans l'encodage choisi.
 */
export default function ConvertisseurTexte({initial = 'Élève : « ça marche ! » 10 €'}: {initial?: string}): ReactNode {
  const [text, setText] = useState(initial);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<number[] | null>(null);
  const textId = useId();
  const fileId = useId();

  const utf8 = encodeText(text, 'utf8') ?? [];
  const latin1 = encodeText(text, 'latin1');

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const bytes = Array.from(new Uint8Array(await file.arrayBuffer())).slice(0, 4000);
    setFileBytes(bytes);
    setFileInfo(`${file.name} — ${file.size} octet${file.size > 1 ? 's' : ''}`);
  };

  return (
    <section className={clsx(s.trainer, t.tool)} aria-label="Convertisseur d’encodages">
      <header className={s.header}>
        <p className={s.kicker}>Outil</p>
        <h3 className={s.title}>Convertisseur d’encodages</h3>
      </header>

      <div className={s.body}>
        <label htmlFor={textId} className={s.fieldLabel}>
          Texte
        </label>
        <textarea id={textId} className={t.textarea} rows={2} value={text} onChange={(e) => setText(e.target.value)} />

        <div className={t.tableWrap}>
          <table className={clsx(s.table, t.table)}>
            <thead>
              <tr>
                <th scope="col">Encodage</th>
                <th scope="col">Taille</th>
                <th scope="col">Octets (hexadécimal)</th>
                <th scope="col">Fichier</th>
              </tr>
            </thead>
            <tbody>
              {ENCODINGS.map((enc) => {
                const bytes = encodeText(text, enc.id);
                const missing = unencodable(text, enc.id);
                return (
                  <tr key={enc.id}>
                    <th scope="row">{enc.label}</th>
                    <td>{bytes ? `${bytes.length} o` : '—'}</td>
                    <td className={t.bytes}>
                      {bytes ? hex(bytes) : <span className={t.missing}>Impossible : « {missing.join(' ')} » n’existe pas dans cet encodage</span>}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={t.small}
                        disabled={!bytes || text === ''}
                        onClick={() => bytes && download(bytes, `texte-${enc.id}.txt`)}
                        aria-label={`Télécharger le texte encodé en ${enc.label}`}>
                        .txt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h4 className={t.subtitle}>Et si on se trompe d’encodage à la lecture ?</h4>
        <dl className={t.misread}>
          <dt>Enregistré en UTF-8, lu en ISO-8859-1</dt>
          <dd>{text ? decodeLatin1(utf8) : '—'}</dd>
          <dt>Enregistré en ISO-8859-1, lu en UTF-8</dt>
          <dd>{latin1 ? decodeUtf8(latin1) : 'Impossible : le texte ne s’encode pas en ISO-8859-1'}</dd>
        </dl>

        <h4 className={t.subtitle}>Ouvrir un fichier texte</h4>
        <p className={s.hint}>
          Le fichier reste sur ton appareil : il n’est envoyé nulle part. On affiche ses octets et sa lecture dans chaque encodage ;
          en cliquant sur « Utiliser », son texte passe dans la zone ci-dessus, où tu peux le réenregistrer dans un autre encodage.
        </p>
        <input id={fileId} type="file" accept=".txt,.csv,.md,.py,.html,text/*" onChange={(e) => onFile(e.target.files?.[0])} />
        {fileBytes && (
          <div className={t.file}>
            <p>
              <strong>{fileInfo}</strong>
              {fileBytes.length >= 4000 && ' (seuls les 4 000 premiers octets sont affichés)'}
            </p>
            <p className={t.bytes}>{hex(fileBytes.slice(0, 48))}{fileBytes.length > 48 ? ' …' : ''}</p>
            <dl className={t.misread}>
              {(['utf8', 'latin1'] as EncodingId[]).map((enc) => {
                const decoded = enc === 'utf8' ? decodeUtf8(fileBytes) : decodeLatin1(fileBytes);
                return (
                  <React.Fragment key={enc}>
                    <dt>Lu en {enc === 'utf8' ? 'UTF-8' : 'ISO-8859-1'}</dt>
                    <dd>
                      <span className={t.preview}>{decoded.slice(0, 160)}{decoded.length > 160 ? '…' : ''}</span>
                      <button type="button" className={t.small} onClick={() => setText(decoded)}>
                        Utiliser
                      </button>
                    </dd>
                  </React.Fragment>
                );
              })}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
