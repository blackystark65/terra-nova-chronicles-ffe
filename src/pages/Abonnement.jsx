import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CreditCard, CheckCircle2, Building2, Shield, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { loadStripe } from '@stripe/stripe-js';

// ⚠️ Remplacez ces valeurs par vos vrais Price IDs Stripe
// Créez des produits dans votre dashboard Stripe → Products → Add product
// puis copiez l'ID du prix (ex: price_1AbCdEfGhIjKlMnO)
const STRIPE_PRICE_IDS = {
  standard: 'price_1TYYQIFeAjEQAsj9KAZKz24t',  // CHF 390/an
  premium:  'price_1TYYSEFeAjEQAsj9O7xjXlJn',   // CHF 690/an
};

const PLANS = [
  {
    id: 'standard',
    name: 'Établissement Standard',
    price: 390,
    currency: 'CHF',
    period: 'an',
    color: 'emerald',
    description: 'Idéal pour les petites et moyennes écoles',
    features: [
      "Jusqu'à 150 élèves",
      'Tous les 12 modules inclus',
      "3 comptes enseignant admin",
      'Support par email',
      'Accès Bio-Focus terrain',
      'Mises à jour incluses',
    ],
    not_included: ['Élèves illimités', 'Personnalisation logo', 'Support prioritaire'],
  },
  {
    id: 'premium',
    name: 'Établissement Premium',
    price: 690,
    currency: 'CHF',
    period: 'an',
    color: 'amber',
    badge: '⭐ Recommandé',
    description: 'La solution complète pour votre établissement',
    features: [
      'Élèves illimités',
      'Tous les 12 modules inclus',
      'Enseignants illimités',
      'Bio-Focus terrain inclus',
      'Support prioritaire',
      'Personnalisation logo',
      'Mises à jour incluses',
      'Tableau de bord statistiques',
    ],
  },
  {
    id: 'reseau',
    name: "Réseau d'écoles",
    price: null,
    currency: 'CHF',
    period: '',
    color: 'blue',
    description: 'Pour les réseaux scolaires et communes',
    features: [
      'Plusieurs établissements',
      'Dashboard centralisé',
      'Formation enseignants incluse',
      'Accompagnement pédagogique',
      'Intégration ENT possible',
      'Contrat personnalisé',
    ],
  },
];

const FAQ = [
  { q: "L'abonnement couvre-t-il tous les élèves de l'école ?", a: "Oui. L'abonnement par établissement donne accès à la plateforme à tous les élèves et enseignants de votre école, sans limite par classe." },
  { q: 'Peut-on essayer avant de payer ?', a: "Contactez-nous pour une démo gratuite de 30 jours. Nous vous créons un accès complet pour votre établissement." },
  { q: 'Comment fonctionne le renouvellement ?', a: "L'abonnement est annuel. Vous recevez un rappel par email 30 jours avant l'échéance. Pas de renouvellement automatique sans accord." },
  { q: 'Y a-t-il une facture pour notre comptabilité scolaire ?', a: "Oui, une facture officielle est générée automatiquement après chaque paiement, téléchargeable depuis votre tableau de bord." },
  { q: 'Les données des élèves sont-elles protégées ?', a: "Toutes les données sont hébergées en Europe (RGPD), chiffrées et jamais revendues à des tiers. Les élèves n'ont pas besoin de renseigner de données personnelles sensibles." },
];

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plan = PLANS.find(p => p.id === selectedPlan);

  const handleStripeCheckout = async () => {
    const priceId = STRIPE_PRICE_IDS[selectedPlan];
    if (!priceId || priceId.includes('A_REMPLACER') || priceId.startsWith('prod_')) {
      setError("⚠️ Les IDs configurés sont des Product IDs (prod_...) mais Stripe Checkout nécessite des Price IDs (price_...). Dans votre dashboard Stripe → Products → cliquez sur le produit → copiez l'ID dans la section « Pricing » qui commence par price_");
      return;
    }
    setLoading(true);
    setError(null);
    const stripe = await loadStripe('pk_live_0L6eLpK72xVAD7QJQ1Yi1hvm');
    const { error: stripeError } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      successUrl: `${window.location.origin}/Abonnement?success=true`,
      cancelUrl: `${window.location.origin}/Abonnement?cancelled=true`,
    });
    if (stripeError) setError(stripeError.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-purple-950">
      <BiolumiHeader currentPage="Abonnement" />

      <main className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-400/20 mb-4">
            <Building2 className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 font-semibold text-sm">Accès par établissement scolaire</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Abonnement <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">Terra Nova</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Un seul abonnement annuel pour toute votre école — élèves et enseignants illimités sur le plan Premium.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(p.id)}
              className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                selectedPlan === p.id
                  ? `bg-${p.color}-500/15 border-${p.color}-400/60 shadow-lg shadow-${p.color}-500/20`
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-black">
                  {p.badge}
                </div>
              )}
              {selectedPlan === p.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className={`w-5 h-5 text-${p.color}-400`} />
                </div>
              )}
              <h3 className={`font-black text-${p.color}-300 text-lg mb-1`}>{p.name}</h3>
              <p className="text-white/40 text-xs mb-4">{p.description}</p>
              <div className="flex items-end gap-1 mb-6">
                {p.price ? (
                  <>
                    <span className={`text-4xl font-black text-${p.color}-200`}>{p.currency} {p.price}</span>
                    <span className={`text-${p.color}-400/60 mb-1`}>/{p.period}</span>
                  </>
                ) : (
                  <span className={`text-3xl font-black text-${p.color}-200`}>Sur devis</span>
                )}
              </div>
              <ul className="space-y-2">
                {p.features.map((f, j) => (
                  <li key={j} className={`flex gap-2 text-sm text-${p.color}-200/70`}>
                    <CheckCircle2 className={`w-4 h-4 text-${p.color}-400 flex-shrink-0 mt-0.5`} />
                    {f}
                  </li>
                ))}
                {p.not_included?.map((f, j) => (
                  <li key={j} className="flex gap-2 text-sm text-white/25 line-through">
                    <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">✗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bouton paiement */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-12 text-center">
          <h3 className="text-2xl font-black text-white mb-2">
            {selectedPlan === 'reseau' ? "Contactez-nous pour un devis" : `Plan sélectionné : ${plan?.name}`}
          </h3>
          {plan?.price && (
            <p className="text-white/50 mb-6">
              {plan.currency} {plan.price} / an — Paiement unique sécurisé via Stripe
            </p>
          )}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-left">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {selectedPlan !== 'reseau' ? (
              <Button
                onClick={handleStripeCheckout}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-2xl shadow-2xl shadow-violet-500/30 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirection Stripe…</>
                ) : (
                  <><CreditCard className="w-5 h-5 mr-2" /> Payer maintenant — {plan?.currency} {plan?.price} / an</>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = 'mailto:contact@terra-nova.edu?subject=Devis réseau écoles Terra Nova'}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-10 py-6 text-lg rounded-2xl"
              >
                📧 Demander un devis
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-white/30 text-xs">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Paiement sécurisé Stripe</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Facture incluse</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Données hébergées en Europe</span>
          </div>
        </motion.div>

        {/* Ce qui est inclus */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Ce qui est inclus dans tous les plans</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { emoji: '🗺️', title: 'Atlas & Biomes', desc: '8 biomes avec espèces et missions' },
              { emoji: '🔬', title: 'Bio-Focus Terrain', desc: 'Jeu de terrain avec codes équipes' },
              { emoji: '♻️', title: 'Recyclage', desc: 'Jeu de tri sélectif 10 zones' },
              { emoji: '🌾', title: 'Micro-ferme', desc: 'Simulation agricole collaborative' },
              { emoji: '🧠', title: 'Quiz & Missions', desc: 'Centaines de questions thématiques' },
              { emoji: '📚', title: 'Encyclopédie IA', desc: 'Agent conversationnel écologie' },
              { emoji: '📖', title: 'Écosphère', desc: '11 chapitres illustrés' },
              { emoji: '🏆', title: 'Profils & XP', desc: 'Progression & badges pour chaque élève' },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className="font-bold text-white/80 text-xs mb-1">{m.title}</div>
                <div className="text-white/40 text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-white/80 text-sm">{faq.q}</span>
                  <span className="text-white/40 text-lg flex-shrink-0 ml-3">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 text-center">
          <p className="text-emerald-300 font-bold mb-2">Besoin d'aide ou d'une démo ?</p>
          <p className="text-emerald-200/60 text-sm mb-4">Notre équipe est disponible pour vous présenter la plateforme et répondre à vos questions.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:contact@terra-nova.edu" className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-400/20 hover:bg-emerald-500/30 transition-all">
              📧 contact@terra-nova.edu
            </a>
            <Link to={createPageUrl('Presentation')}>
              <button className="px-4 py-2 rounded-xl bg-white/10 text-white/60 text-sm font-semibold border border-white/10 hover:bg-white/20 transition-all">
                🎥 Voir la présentation
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}