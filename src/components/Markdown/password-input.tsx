import React from 'react';
import confetti from 'canvas-confetti';

export default function PasswordInput ({ truePassword }: {truePassword: string}) {
    // Récupérer le mot de passe rentré dans l'input et vérifier que le mot de passe est correct

    const launchConfetti = () => {
            const duration = 1000;
            const end = Date.now() + duration;
    
            const colors = ['#00c851', '#007E33'];
    
            (function frame() {
                confetti({
                    particleCount: 10,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                });
                confetti({
                    particleCount: 10,
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

    return ( 
        <form onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const inputPassword = formData.get('password-input').toString().toUpperCase();
            if (inputPassword === truePassword) {
                launchConfetti()
                document.getElementById('password-input-feedback').innerHTML = 'Mot de passe correct !';
            } else {
                document.getElementById('password-input-feedback').innerHTML = 'Mot de passe incorrect !';
            }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="password" name="password-input" placeholder="Mot de passe" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }} />
            <button type="submit" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', cursor: 'pointer' }}>
                Valider
            </button>
            <p id="password-input-feedback" style={{ color: 'red', fontSize: '14px' }}>
                {/* Le feedback sera affiché ici */}
            </p>
        </form>
    )
};