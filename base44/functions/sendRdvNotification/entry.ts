import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { rdv } = body;

    const typeLabels = {
      decouverte_biodiversite: 'Découverte Biodiversité',
      bio_focus_terrain: 'Bio-Focus Terrain',
      permaculture: 'Permaculture',
      recyclage: 'Recyclage',
      autre: 'Autre',
    };

    const emailBody = `
Nouvelle demande de RDV sur Terra Nova 🌿

📚 École : ${rdv.nom_ecole}
👤 Enseignant : ${rdv.nom_enseignant}
📧 Email : ${rdv.email_enseignant}
🎓 Classe : ${rdv.classe_niveau} (${rdv.nombre_eleves || 'N/A'} élèves)
🗓️ Date souhaitée : ${rdv.date_souhaitee}
${rdv.date_alternative ? `📅 Date alternative : ${rdv.date_alternative}` : ''}
🌲 Type d'atelier : ${typeLabels[rdv.type_atelier] || rdv.type_atelier}
${rdv.message ? `💬 Message : ${rdv.message}` : ''}

---
Connectez-vous à l'interface admin pour confirmer ou refuser cette demande.
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'brunolivier@yahoo.com',
      subject: `🌿 Nouvelle demande de RDV - ${rdv.nom_ecole} (${rdv.date_souhaitee})`,
      body: emailBody,
    });

    // Envoyer confirmation à l'enseignant
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: rdv.email_enseignant,
      subject: `✅ Demande de RDV Terra Nova reçue`,
      body: `Bonjour ${rdv.nom_enseignant},

Nous avons bien reçu votre demande de RDV pour le ${rdv.date_souhaitee}.

Notre équipe vous contactera dans les plus brefs délais pour confirmer votre créneau.

À bientôt,
L'équipe Terra Nova 🌿`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});