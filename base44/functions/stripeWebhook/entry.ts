import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const PLAN_CONFIG = {
  'price_1TYYQIFeAjEQAsj9KAZKz24t': {
    id: 'standard',
    name: 'Établissement Standard',
    amount: 390,
    invitations_quota: 150,
  },
  'price_1TYYSEFeAjEQAsj9O7xjXlJn': {
    id: 'premium',
    name: 'Établissement Premium',
    amount: 690,
    invitations_quota: -1, // illimité
  },
  'price_1TYoRqFeAjEQAsj9RQ4w6VR0': {
    id: 'individuel',
    name: 'Individuel',
    amount: 240,
    invitations_quota: 1,
  },
  'price_1TYoTlFeAjEQAsj9ANvn3M4m': {
    id: 'famille',
    name: 'Famille',
    amount: 290,
    invitations_quota: 5,
  },
};

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const base44 = createClientFromRequest(req);

    try {
      // Récupérer les line items pour identifier le plan
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const planConfig = PLAN_CONFIG[priceId];

      if (!planConfig) {
        console.error('Plan inconnu pour le price_id:', priceId);
        return Response.json({ received: true });
      }

      const customerEmail = session.customer_details?.email || session.customer_email;

      // Calculer la date d'expiration (1 an)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // Créer l'enregistrement de souscription
      await base44.asServiceRole.entities.Subscription.create({
        stripe_session_id: session.id,
        stripe_customer_email: customerEmail,
        plan_id: planConfig.id,
        plan_name: planConfig.name,
        amount_paid: planConfig.amount,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        invitations_quota: planConfig.invitations_quota,
        invitations_used: 0,
        admin_email: customerEmail,
      });

      // Inviter l'utilisateur admin avec le rôle "user" (ou "admin" si premium)
      const role = (planConfig.id === 'premium' || planConfig.id === 'standard') ? 'admin' : 'user';
      
      try {
        await base44.asServiceRole.users.inviteUser(customerEmail, role);
        console.log(`Invitation envoyée à ${customerEmail} avec le rôle ${role}`);
      } catch (inviteErr) {
        console.log(`Utilisateur déjà existant ou erreur invitation: ${inviteErr.message}`);
      }

      console.log(`Abonnement ${planConfig.name} créé pour ${customerEmail}`);
    } catch (err) {
      console.error('Erreur traitement webhook:', err.message);
      return Response.json({ error: err.message }, { status: 500 });
    }
  }

  return Response.json({ received: true });
});