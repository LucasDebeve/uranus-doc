import React from 'react';
import DocItem from '@theme-original/DocItem';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DocItemWrapper(props) {
  // Vérifie si c'est une doc du plugin "pedagogie"
  const isPedagogie = props.content.metadata.permalink?.startsWith('/pedagogie/');
  
  if (isPedagogie) {
    return (
      <ProtectedRoute>
        <DocItem {...props} />
      </ProtectedRoute>
    );
  }

  return <DocItem {...props} />;
}
