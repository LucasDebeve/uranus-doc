import React from 'react';

export default function PasswordInput ({ truePassword }: {truePassword: string}) {
    // Récupérer le mot de passe rentré dans l'input et vérifier que le mot de passe est correct
    return ( 
        <form onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const inputPassword = formData.get('password-input');
            if (inputPassword === truePassword) {
                alert('Mot de passe correct !');
            } else {
                alert('Mot de passe incorrect !');
            }
        }}>
            <input type="password" name="password-input" placeholder="Mot de passe" />
            <button type="submit">Valider</button>
        </form>
    )
};