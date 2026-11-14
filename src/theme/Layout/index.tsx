import React, {type ReactNode} from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import SettingsDialog from '@site/src/components/A11y/SettingsDialog';
import SeasonalEffects from '@site/src/components/Seasons/SeasonalEffects';

type Props = WrapperProps<typeof LayoutType> & {children?: ReactNode};

/** Ajoute à chaque page le panneau de réglages et les effets saisonniers. */
export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <Layout {...props}>
      {props.children}
      <SettingsDialog />
      <SeasonalEffects />
    </Layout>
  );
}
