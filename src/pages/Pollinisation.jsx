import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  // ── SLIDE 0 : Couverture ──
  {
    id: 'cover',
    bg: 'from-yellow-950 via-amber-950 to-orange-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl md:text-9xl mb-6"
        >
          🐝
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
          La Pollinisation
        </h1>
        <p className="text-xl md:text-2xl text-amber-200/80 mb-6 max-w-2xl">
          Le secret de la vie sur Terre… porté sur des ailes
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['🌸 Plantes', '🐝 Abeilles', '🦋 Papillons', '🌍 Biodiversité'].map(p => (
            <span key={p} className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-semibold">
              {p}
            </span>
          ))}
        </div>
        <p className="text-amber-400/50 text-sm italic">Utilisez les flèches pour naviguer →</p>
      </div>
    ),
  },

  // ── SLIDE 1 : Qu'est-ce que la pollinisation ? ──
  {
    id: 'definition',
    bg: 'from-amber-950 via-yellow-950 to-lime-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-3xl">🌸</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Qu'est-ce que la pollinisation ?</h2>
        </div>
        <p className="text-amber-200/80 text-lg mb-8 leading-relaxed">
          La pollinisation est le transfert de <strong className="text-yellow-300">grains de pollen</strong> d'une fleur mâle vers le pistil d'une fleur femelle, permettant la fécondation et la production de fruits et graines.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '🌺', title: 'Fleur → Pollen', desc: 'Les étamines produisent des millions de grains de pollen microscopiques.' },
            { emoji: '🐝', title: 'Transporteur', desc: 'Un pollinisateur visite la fleur, collecte le pollen et le transporte vers une autre fleur.' },
            { emoji: '🍎', title: 'Fruit & Graine', desc: 'La fécondation donne naissance à un fruit contenant des graines qui germeront.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="p-5 rounded-2xl bg-white/5 border border-amber-400/20 text-center">
              <div className="text-5xl mb-3">{s.emoji}</div>
              <h3 className="font-bold text-amber-300 mb-2">{s.title}</h3>
              <p className="text-amber-200/60 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm">
          🌍 <strong>Le saviez-vous ?</strong> 90 % des plantes à fleurs dépendent des pollinisateurs pour se reproduire. Sans eux, la plupart des écosystèmes s'effondreraient.
        </div>
      </div>
    ),
  },

  // ── SLIDE 2 : Importance mondiale ──
  {
    id: 'importance',
    bg: 'from-green-950 via-emerald-950 to-teal-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-3xl">🌍</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Pourquoi est-ce <span className="text-emerald-300">vital</span> ?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            { emoji: '🍓', stat: '75%', label: 'des cultures alimentaires mondiales', desc: 'dépendent des pollinisateurs, notamment les fruits, légumes, noix et oléagineux.' },
            { emoji: '💰', stat: '153 Mds€', label: 'de valeur économique', desc: 'La pollinisation représente chaque année en Europe une valeur estimée à 153 milliards d\'euros.' },
            { emoji: '🌱', stat: '90%', label: 'des plantes sauvages', desc: 'se reproduisent grâce à la pollinisation croisée assurée par les insectes et autres animaux.' },
            { emoji: '🦜', stat: '3/4', label: 'des espèces de plantes à fleurs', desc: 'sur Terre dépendent de la pollinisation animale pour assurer leur survie et évolution.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-emerald-400/20">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <div className="text-3xl font-black text-emerald-300">{item.stat}</div>
                  <div className="text-sm font-semibold text-emerald-200 mb-1">{item.label}</div>
                  <p className="text-emerald-200/60 text-xs">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-200 text-sm">
          ⚠️ <strong>Alerte :</strong> Sans pollinisateurs, notre alimentation serait réduite à des cultures comme le blé, le maïs ou le riz — la diversité nutritionnelle disparaîtrait.
        </div>
      </div>
    ),
  },

  // ── SLIDE 3 : Comprendre les abeilles sauvages ──
  {
    id: 'abeilles-sauvages',
    bg: 'from-yellow-950 via-amber-950 to-orange-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 text-3xl">🐝</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Comprendre les Abeilles Sauvages</h2>
            <p className="text-yellow-400/60 text-sm">Connaissances de base et importance écologique</p>
          </div>
        </div>

        {/* Photo gallery + texte intro */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-3">
            <p className="text-yellow-200/80 text-sm leading-relaxed">
              À quoi pensez-vous quand on parle d'abeilles ? Au miel, bien sûr ! Mais outre l'abeille domestique, il existe <strong className="text-yellow-300">plus de 20 000 espèces</strong> d'abeilles sauvages à travers le monde — soit plus que toutes les espèces de mammifères réunies (5 500 espèces).
            </p>
            <p className="text-yellow-200/70 text-sm leading-relaxed">
              Les abeilles sauvages sont <strong className="text-amber-300">toutes les espèces vivant à l'état naturel</strong>, non élevées par l'homme. En Allemagne seule, on recense environ 600 espèces dont la célèbre abeille maçonne rouge (<em>Osmia bicornis</em>).
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
              🌟 <strong>Fait :</strong> Une seule abeille solitaire pollinise autant que 120 abeilles domestiques !
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/afce2a238_Bienenhotel_fur_Wildbienen_Wildbiene_Gehornte_Mauerbiene_bei_Paarung.jpg"
              alt="Osmia bicornis sur marguerite" className="w-full h-28 object-cover rounded-xl border border-yellow-400/20" />
            <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/ec051e089_Wildbiene_Anthemis_tinctoria_male_2_1445x.jpg"
              alt="Abeille sauvage sur fleur jaune" className="w-full h-28 object-cover rounded-xl border border-yellow-400/20" />
            <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/bfb9b4ec8_Wildbiene_Halictus_scabiosae_Cirsium_vulgare_4_1445x.jpg"
              alt="Abeilles sur chardon" className="w-full h-28 object-cover rounded-xl border border-yellow-400/20" />
            <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/51f9e19ca_Wildbiene_Lasioglossum_Campanula_1100x.jpg"
              alt="Lasioglossum sur campanule" className="w-full h-28 object-cover rounded-xl border border-yellow-400/20" />
          </div>
        </div>

        {/* Diversité & couleurs */}
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { emoji: '🎨', title: 'Diversité des couleurs', desc: 'Du brun profond au bleu métallique chatoyant, en passant par les motifs noirs et jaunes contrastés — leur palette est infinie.' },
            { emoji: '📏', title: 'Toutes les tailles', desc: 'De l\'abeille masquée (quelques mm) à l\'abeille charpentière (plusieurs cm), la diversité morphologique est étonnante.' },
            { emoji: '🏘️', title: 'Habitats variés', desc: '70% sont solitaires. Elles nichent dans le sol, le bois en décomposition, les tiges ou même des coquilles d\'escargots vides !' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-yellow-400/20">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <h3 className="font-bold text-yellow-300 text-xs mb-1">{item.title}</h3>
              <p className="text-yellow-200/60 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 3b : Vie sociale & nidification ──
  {
    id: 'nidification',
    bg: 'from-orange-950 via-amber-950 to-yellow-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30 text-3xl">🏠</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Vie & Nidification</h2>
            <p className="text-orange-400/60 text-sm">Comment vivent vraiment les abeilles sauvages ?</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Texte */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <h3 className="font-bold text-orange-300 mb-2">🐝 Solitaires vs Sociales</h3>
              <p className="text-orange-200/70 text-sm leading-relaxed">
                Contrairement aux abeilles domestiques (jusqu'à <strong className="text-orange-300">40 000 individus</strong> par colonie), la plupart des abeilles sauvages vivent <strong className="text-yellow-300">en solitaires</strong>. Chaque femelle pond ses œufs et s'occupe seule de son couvain — comme l'<em>Osmia bicornis</em>.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <h3 className="font-bold text-orange-300 mb-2">🏘️ Nids ingénieux</h3>
              <p className="text-orange-200/70 text-sm leading-relaxed">
                Elles choisissent des emplacements variés : <strong className="text-amber-300">sol, bois en décomposition, tiges creuses, coquilles d'escargots</strong>. Les hôtels à insectes comme le <em>BeeHome</em> (photos ci-contre) reproduisent ces habitats naturels.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <h3 className="font-bold text-orange-300 mb-2">👥 Les semi-sociales</h3>
              <p className="text-orange-200/70 text-sm leading-relaxed">
                Quelques espèces comme les <strong className="text-yellow-300">bourdons</strong> ou certaines abeilles de la sueur (<em>Lasioglossum</em>) présentent un comportement social marqué — une transition fascinante entre solitude et vie en communauté.
              </p>
            </div>
          </div>

          {/* Photos BeeHome */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/1fd5b7f2d_20240520_142518.jpg"
                alt="BeeHome dans serre" className="w-full h-36 object-cover rounded-xl border border-orange-400/20" />
              <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/2ce41981a_20240520_142530.jpg"
                alt="BeeHome Wildbiene+Partner" className="w-full h-36 object-cover rounded-xl border border-orange-400/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/38a192c73_Osmia_bicornis_kommt_aus_Nistrohr_1100x.jpg"
                alt="Osmia bicornis sortant du tube" className="w-full h-36 object-cover rounded-xl border border-orange-400/20" />
              <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/de2df8b3e_Wildbiene_BeeHome_Megachile_ericetorum_nest_2_1445x.jpg"
                alt="Megachile dans son nid" className="w-full h-36 object-cover rounded-xl border border-orange-400/20" />
            </div>
            <p className="text-orange-300/60 text-xs text-center italic">
              📸 Hôtels à abeilles sauvages (BeeHome) installés dans notre serre — Terra Nova
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 3c : Habitat & Biodiversité ──
  {
    id: 'habitat-biodiversite',
    bg: 'from-lime-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-lime-500/20 border border-lime-400/30 text-3xl">🌿</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Habitat & Biodiversité</h2>
            <p className="text-lime-400/60 text-sm">Pourquoi les habitats disparaissent — et comment les protéger</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Menaces */}
          <div className="space-y-3">
            <h3 className="font-bold text-lime-300 text-base mb-2">⚠️ Les menaces sur les habitats</h3>
            {[
              { emoji: '🧪', title: 'Pesticides', desc: 'Les néonicotinoïdes peuvent anéantir les abeilles sauvages même à faibles doses. Les herbicides détruisent leurs plantes nourricières.' },
              { emoji: '🌾', title: 'Prairies appauvrries', desc: 'La fertilisation excessive favorise les graminées au détriment des fleurs sauvages (pissenlit, marguerite, bouton d\'or). Résultat : des déserts verts monotones.' },
              { emoji: '🏗️', title: 'Étalement urbain', desc: 'L\'intensification agricole et l\'urbanisation réduisent drastiquement les habitats riches en structures et en fleurs indigènes.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex gap-3 p-3 rounded-xl bg-white/5 border border-lime-400/20">
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h4 className="font-bold text-lime-300 text-sm mb-0.5">{item.title}</h4>
                  <p className="text-lime-200/60 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solutions + photos BeeHome */}
          <div className="space-y-3">
            <h3 className="font-bold text-emerald-300 text-base mb-2">✅ Créer des habitats adaptés</h3>
            <p className="text-emerald-200/70 text-sm leading-relaxed mb-3">
              L'idéal est de placer les nids <strong className="text-emerald-300">à proximité directe de fleurs indigènes</strong>, dans des endroits ensoleillés, secs, à sol maigre — idéalement une pente exposée au sud. Il n'y a pas de taille minimale : plusieurs petites surfaces à différents endroits sont aussi utiles qu'une grande.
            </p>
            {/* Photos BeeHome Classic & Expert */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/4a33655b7_BeeHome_Classic_mit_Schublade_Wildbienen-Nisthilfe_fur_Garten_Balkon.jpg"
                  alt="BeeHome Classic" className="w-full h-36 object-contain rounded-xl bg-amber-50/5 border border-lime-400/20" />
                <p className="text-lime-400/60 text-xs text-center mt-1">BeeHome Classic</p>
              </div>
              <div>
                <img src="https://media.base44.com/images/public/6959886137576a65dcfe1370/f2f13ed3c_BeeHome_Expert_Vielfalt_Wildbienen-Nisthilfe_fur_Garten_Balkon.jpg"
                  alt="BeeHome Expert" className="w-full h-36 object-contain rounded-xl bg-amber-50/5 border border-lime-400/20" />
                <p className="text-lime-400/60 text-xs text-center mt-1">BeeHome Expert — 4 modules</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-200 text-xs">
              🌻 <strong>Conseil :</strong> Installez votre hôtel à abeilles face au soleil (sud/sud-est) à 1–2m de hauteur, entouré de fleurs sauvages indigènes !
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 3d : Fiches espèces abeilles sauvages ──
  {
    id: 'fiches-especes',
    bg: 'from-sky-950 via-slate-900 to-blue-950',
    content: (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-3xl">🔬</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Fiches Espèces</h2>
            <p className="text-sky-400/60 text-sm">Abeilles sauvages de nos régions — Wildbiene+Partner</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Fiche 1 — Megachile willughbiella */}
          <div className="rounded-2xl overflow-hidden border border-sky-400/20 bg-white/5">
            <img
              src="https://media.base44.com/images/public/6959886137576a65dcfe1370/8951a615c_Scan_20260501_111247.jpg"
              alt="Abeille coupeuse de feuilles des jardins"
              className="w-full h-52 object-cover object-top"
            />
            <div className="p-4">
              <h3 className="font-black text-white text-base mb-0.5">Abeille coupeuse de feuilles des jardins</h3>
              <p className="text-sky-300/70 text-xs italic mb-3">Megachile willughbiella</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {[
                  ['Longueur', '12-15 mm'], ['Vol', 'juin–septembre'],
                  ['Générations/an', '1-2'], ['Abondance', 'répandue'],
                  ['Altitude', 'jusqu\'à 2000 m'], ['Galerie Ø', '6-8 mm'],
                  ['Plantes', 'campanules, lotiers, gesses'], ['Opercule', 'morceaux de feuilles'],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-sky-400 font-semibold">{k} : </span><span className="text-white/70">{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Fiche 2 — Chelostoma florisomne */}
          <div className="rounded-2xl overflow-hidden border border-sky-400/20 bg-white/5">
            <img
              src="https://media.base44.com/images/public/6959886137576a65dcfe1370/570eefe27_Scan_20260501_110810.jpg"
              alt="Chélostome des renoncules"
              className="w-full h-52 object-cover object-top"
            />
            <div className="p-4">
              <h3 className="font-black text-white text-base mb-0.5">Chélostome des renoncules</h3>
              <p className="text-sky-300/70 text-xs italic mb-3">Chelostoma florisomne</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {[
                  ['Longueur', '8-11 mm'], ['Vol', 'avril–juin'],
                  ['Générations/an', '1'], ['Abondance', 'fréquente'],
                  ['Altitude', 'jusqu\'à 2200 m'], ['Galerie Ø', '3-5 mm'],
                  ['Plantes', 'renoncule (spécialisée)'], ['Opercule', 'argile, sable'],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-sky-400 font-semibold">{k} : </span><span className="text-white/70">{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Fiche 3 — Chelostoma rapunculi */}
          <div className="rounded-2xl overflow-hidden border border-sky-400/20 bg-white/5">
            <img
              src="https://media.base44.com/images/public/6959886137576a65dcfe1370/bd76a9d52_Scan_20260501_110834.jpg"
              alt="Chélostome des campanules"
              className="w-full h-52 object-cover object-top"
            />
            <div className="p-4">
              <h3 className="font-black text-white text-base mb-0.5">Chélostome des campanules</h3>
              <p className="text-sky-300/70 text-xs italic mb-3">Chelostoma rapunculi</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {[
                  ['Longueur', '7-9 mm'], ['Vol', 'juin–août'],
                  ['Générations/an', '1'], ['Abondance', 'moyenne'],
                  ['Altitude', 'jusqu\'à 2000 m'], ['Galerie Ø', '3-4 mm'],
                  ['Plantes', 'campanules (spécialisée)'], ['Opercule', 'argile, sable'],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-sky-400 font-semibold">{k} : </span><span className="text-white/70">{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Fiche 4 — Heriades truncorum */}
          <div className="rounded-2xl overflow-hidden border border-sky-400/20 bg-white/5">
            <img
              src="https://media.base44.com/images/public/6959886137576a65dcfe1370/c26ca1b4d_Scan_20260501_110848.jpg"
              alt="Hériade des troncs"
              className="w-full h-52 object-cover object-top"
            />
            <div className="p-4">
              <h3 className="font-black text-white text-base mb-0.5">Hériade des troncs</h3>
              <p className="text-sky-300/70 text-xs italic mb-3">Heriades truncorum</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {[
                  ['Longueur', '5-7 mm'], ['Vol', 'avril–juin'],
                  ['Générations/an', '1'], ['Abondance', 'répandue'],
                  ['Altitude', 'jusqu\'à 1600 m'], ['Galerie Ø', '2-5 mm'],
                  ['Plantes', 'camomille, œil-de-bœuf, chicorée'], ['Opercule', 'résine, petites pierres'],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-sky-400 font-semibold">{k} : </span><span className="text-white/70">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 4 : Les papillons ──
  {
    id: 'papillons',
    bg: 'from-purple-950 via-pink-950 to-rose-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-3xl">🦋</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Les Papillons</h2>
            <p className="text-purple-400/60 text-sm">Pollinisateurs élégants et indicateurs de santé</p>
          </div>
        </div>
        <p className="text-purple-200/80 text-lg mb-6">
          Avec <strong className="text-purple-300">plus de 180 000 espèces</strong> de lépidoptères, les papillons sont des pollinisateurs essentiels, notamment pour les fleurs colorées et parfumées.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '🌸', title: 'Fleurs préférées', desc: 'Ils privilégient les fleurs plates, parfumées et de couleurs vives : lavande, buddleia, origan.' },
            { emoji: '🧭', title: 'Navigateurs de longue distance', desc: 'Le Monarque parcourt 4 000 km en pollinisant les fleurs tout au long de sa migration.' },
            { emoji: '🌡️', title: 'Indicateurs climatiques', desc: 'La présence de papillons est un excellent indicateur de la santé d\'un écosystème et du climat.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-purple-400/20 text-center">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-purple-300 mb-2 text-sm">{item.title}</h3>
              <p className="text-purple-200/60 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-purple-400/20">
          <h3 className="font-bold text-purple-300 mb-3">🦋 Quelques espèces emblématiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['🦋 Monarque', '🦋 Machaon', '🦋 Vulcain', '🦋 Aurore'].map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-purple-500/10 text-center text-purple-300 text-sm font-semibold">{b}</div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 5 : Les autres pollinisateurs ──
  {
    id: 'autres-pollinisateurs',
    bg: 'from-teal-950 via-cyan-950 to-blue-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-3xl">🌀</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Les Autres <span className="text-teal-300">Pollinisateurs</span></h2>
        </div>
        <p className="text-teal-200/80 text-lg mb-6">
          Les abeilles et papillons ne sont pas seuls ! Une multitude d'animaux contribuent à la pollinisation à travers le monde.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            { emoji: '🦟', name: 'Mouches & Syrphes', desc: 'Souvent négligées, les mouches pollinisent de nombreuses plantes et sont les 2e pollinisateurs en importance après les abeilles. Les syrphes ressemblent aux guêpes mais sont totalement inoffensifs.' },
            { emoji: '🦗', name: 'Coléoptères', desc: 'Les plus anciens pollinisateurs de la Terre (300 millions d\'années). Ils pollinisent des plantes primitives comme les magnolias et les nénuphars.' },
            { emoji: '🦇', name: 'Chauves-souris', desc: 'Pollinisatrices nocturnes essentielles sous les tropiques. Elles pollinisent notamment les fleurs de banane, de mangue et d\'agave (pour la tequila !).' },
            { emoji: '🐦', name: 'Oiseaux', desc: 'Les colibris en Amérique, les souïmangas en Afrique et Asie, ou les loriquets en Océanie pollinisent des milliers de plantes grâce à leur long bec.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-teal-400/20">
              <div className="flex gap-3">
                <span className="text-4xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="font-bold text-teal-300 mb-2">{item.name}</h3>
                  <p className="text-teal-200/60 text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 text-teal-200 text-sm">
          🌺 <strong>Anecdote :</strong> En Nouvelle-Zélande, certains geckos et lézards jouent un rôle de pollinisateurs pour des fleurs qui s'ouvrent la nuit !
        </div>
      </div>
    ),
  },

  // ── SLIDE 6 : Les menaces ──
  {
    id: 'menaces',
    bg: 'from-red-950 via-orange-950 to-amber-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-3xl">⚠️</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Les <span className="text-red-300">Menaces</span></h2>
        </div>
        <p className="text-red-200/80 text-lg mb-6">
          Les populations de pollinisateurs sont en <strong className="text-red-300">déclin alarmant</strong> à travers le monde. Plusieurs facteurs en sont responsables.
        </p>
        <div className="space-y-4 mb-6">
          {[
            { emoji: '🧪', name: 'Pesticides', level: 90, desc: 'Les néonicotinoïdes perturbent le système nerveux des abeilles, altèrent leur navigation et leur mémoire.' },
            { emoji: '🏗️', name: 'Perte d\'habitat', level: 75, desc: 'L\'urbanisation et l\'agriculture intensive détruisent les prairies fleuries et zones de nidification.' },
            { emoji: '🌡️', name: 'Changement climatique', level: 65, desc: 'Les décalages de floraison et la prolifération de maladies fragilisent les colonies.' },
            { emoji: '🦠', name: 'Maladies & parasites', level: 55, desc: 'Le varroa (acarien) décime les colonies d\'abeilles. Les champignons et virus se propagent rapidement.' },
          ].map((threat, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-red-400/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{threat.emoji}</span>
                <h3 className="font-bold text-red-300 flex-1">{threat.name}</h3>
                <span className="text-red-400 font-bold text-sm">{threat.level}%</span>
              </div>
              <div className="w-full bg-red-950 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${threat.level}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-red-200/60 text-xs">{threat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 7 : Agir ──
  {
    id: 'agir',
    bg: 'from-lime-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-lime-500/20 border border-lime-400/30 text-3xl">🌱</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Comment <span className="text-lime-300">Agir</span> ?</h2>
        </div>
        <p className="text-lime-200/80 text-lg mb-6">
          Chacun peut contribuer à protéger les pollinisateurs, quel que soit son espace de vie !
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            { emoji: '🌸', title: 'Planter des fleurs mellifères', desc: 'Lavande, bourrache, phacélie, trèfle, tournesol... Ces plantes nourrissent les pollinisateurs toute l\'année.' },
            { emoji: '🏡', title: 'Créer des abris', desc: 'Hôtels à insectes, tas de bois mort, zones de sol nu pour les abeilles solitaires qui nichent dans la terre.' },
            { emoji: '🚫', title: 'Bannir les pesticides', desc: 'Opter pour des méthodes naturelles : purin d\'ortie, savon noir, associations de plantes compagnes.' },
            { emoji: '💧', title: 'Proposer de l\'eau', desc: 'Une coupelle avec des galets et de l\'eau permet aux abeilles de s\'hydrater, surtout en été.' },
            { emoji: '🌿', title: 'Laisser pousser', desc: 'Accepter les "mauvaises herbes" comme le pissenlit et la ortie — essentielles pour les pollinisateurs au printemps.' },
            { emoji: '📢', title: 'Sensibiliser', desc: 'Parler de la pollinisation autour de soi, soutenir les apiculteurs locaux, acheter du miel artisanal.' },
          ].map((action, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-lime-400/20">
              <span className="text-3xl flex-shrink-0">{action.emoji}</span>
              <div>
                <h3 className="font-bold text-lime-300 mb-1 text-sm">{action.title}</h3>
                <p className="text-lime-200/60 text-xs">{action.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 8 : Quiz rapide ──
  {
    id: 'quiz',
    bg: 'from-indigo-950 via-purple-950 to-pink-950',
    content: (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-3xl">🧠</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Le Sais-tu ?</h2>
        </div>
        <p className="text-indigo-200/70 mb-6">Quelques chiffres étonnants sur la pollinisation…</p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { q: 'Quelle distance parcourt une abeille par jour ?', r: '🐝 Jusqu\'à 8 km par sortie, soit des centaines de km par semaine !', color: 'yellow' },
            { q: 'Combien de fleurs pour 1 pot de miel ?', r: '🍯 Environ 2 millions de fleurs visitées pour 1 kg de miel !', color: 'amber' },
            { q: 'Quel est le plus grand pollinisateur du monde ?', r: '🍇 Le gecko de l\'île Nosy Be (Madagascar) visite les fleurs d\'arbres géants !', color: 'green' },
            { q: 'Depuis quand les abeilles pollinisent-elles ?', r: '🦕 Depuis plus de 100 millions d\'années, avant même les dinosaures !', color: 'purple' },
            { q: 'Combien d\'espèces d\'abeilles en Europe ?', r: '🗺️ Plus de 2 000 espèces d\'abeilles sauvages rien qu\'en Europe !', color: 'blue' },
            { q: 'Quelle plante dépend à 100% d\'une espèce précise ?', r: '🌵 Le yucca et son papillon de nuit yucca moth — relation unique au monde !', color: 'pink' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-indigo-400/20">
              <p className="text-indigo-300 font-semibold text-sm mb-2">❓ {item.q}</p>
              <p className="text-white/70 text-sm bg-white/5 rounded-xl p-3">{item.r}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 9 : Conclusion ──
  {
    id: 'conclusion',
    bg: 'from-amber-950 via-yellow-950 to-lime-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🌻
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Protégeons les Pollinisateurs</h2>
        <p className="text-amber-200/70 text-lg mb-8 max-w-2xl">
          Sans eux, <strong className="text-yellow-300">un repas sur trois disparaîtrait</strong> de nos assiettes. Les pollinisateurs sont des héros invisibles — à nous de les protéger !
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { emoji: '🐝', label: '20 000 espèces d\'abeilles' },
            { emoji: '🦋', label: '180 000 espèces de papillons' },
            { emoji: '🦇', label: '1 300 espèces de chauves-souris' },
            { emoji: '🐦', label: 'Milliers d\'oiseaux pollinisateurs' },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="px-5 py-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center">
              <div className="text-3xl mb-1">{p.emoji}</div>
              <div className="text-amber-300 text-xs font-semibold">{p.label}</div>
            </motion.div>
          ))}
        </div>
        <Link to={createPageUrl('Home')}>
          <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-5 text-base rounded-2xl shadow-2xl shadow-amber-500/30">
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    ),
  },
];

export default function PollinisationPage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  const slide = SLIDES[current];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      <BiolumiHeader currentPage="Pollinisation" />

      <main className="pt-16 h-screen flex flex-col">
        {/* Slide */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-h-full"
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de navigation */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Précédent</span>
          </button>

          {/* Indicateurs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[60vw]">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <span className="hidden sm:inline text-sm">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}