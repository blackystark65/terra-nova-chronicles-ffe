import React from 'react';

/**
 * Synchronise les points gagnés dans Terra Nova avec Holo-Nexus
 */
export async function sendPointsToHoloNexus(userEmail, pointsEarned, timePlayedMinutes) {
    try {
        const response = await fetch('https://chroniques-galactiques.org/api/functions/syncGamePoints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: userEmail,
                game_id: 'terra_nova',
                game_name: 'Terra Nova',
                points_earned: pointsEarned,
                time_played: timePlayedMinutes
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Points synchronisés avec Holo-Nexus:', result);
            return { success: true, data: result };
        } else {
            console.error('❌ Erreur:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Erreur de connexion à Holo-Nexus:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Hook pour tracker le temps de jeu d'une session
 */
export function useGameSession() {
    const [sessionStart] = React.useState(() => Date.now());
    
    const getSessionDuration = () => {
        return Math.floor((Date.now() - sessionStart) / 60000); // minutes
    };
    
    return { getSessionDuration };
}