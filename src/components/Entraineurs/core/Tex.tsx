import React, {type ReactNode} from 'react';
import katex from 'katex';

/** Formule KaTeX (les styles sont chargés globalement dans src/theme/Root.tsx). */
export default function Tex({tex, block = false}: {tex: string; block?: boolean}): ReactNode {
  const html = katex.renderToString(tex, {throwOnError: false, displayMode: block, strict: false});
  const Tag = block ? 'div' : 'span';
  return <Tag className={block ? 'tex-block' : undefined} dangerouslySetInnerHTML={{__html: html}} />;
}
