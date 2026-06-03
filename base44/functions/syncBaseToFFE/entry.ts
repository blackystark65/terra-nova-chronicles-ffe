import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_REPO = 'blackystark65/terra-nova-chronicles-Base';
const FFE_REPO = 'blackystark65/terra-nova-chronicles-ffe';

// Fichiers Base à synchroniser vers FFE
const FILES_TO_SYNC = [
  'src/pages/MahjongEco.jsx',
  'src/pages/AdminEcoPairs.jsx',
  'src/data/ecoPairsData.js',
  'src/components/biofocus/TeacherPanel.jsx',
  'src/components/biofocus/StudentJoin.jsx',
  'src/components/shared/BiolumiHeader.jsx',
  'src/components/recyclage/WasteCollectionZone.jsx',
  'src/pages/BioFocus.jsx',
  'src/App.jsx',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    const results = [];

    for (const filePath of FILES_TO_SYNC) {
      // 1. Lire le contenu depuis Base
      const baseRes = await fetch(`https://api.github.com/repos/${BASE_REPO}/contents/${filePath}`, { headers });
      if (!baseRes.ok) {
        results.push({ file: filePath, status: 'not_found', detail: `Base file missing` });
        continue;
      }
      const baseData = await baseRes.json();
      const content = baseData.content; // base64 encodé

      // 2. Lire le SHA actuel dans FFE (pour le update)
      const ffeRes = await fetch(`https://api.github.com/repos/${FFE_REPO}/contents/${filePath}`, { headers });
      let ffeSha = null;
      if (ffeRes.ok) {
        const ffeData = await ffeRes.json();
        ffeSha = ffeData.sha;
      }

      // 3. Si même SHA → skip
      if (ffeSha && ffeSha === baseData.sha) {
        results.push({ file: filePath, status: 'skipped', detail: 'identical' });
        continue;
      }

      // 4. Pousser vers FFE
      const body = {
        message: `sync: update from Base version to ${filePath}`,
        content: content,
        ...(ffeSha ? { sha: ffeSha } : {}),
      };

      const pushRes = await fetch(`https://api.github.com/repos/${FFE_REPO}/contents/${filePath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (pushRes.ok) {
        results.push({ file: filePath, status: 'updated' });
      } else {
        const err = await pushRes.text();
        results.push({ file: filePath, status: 'error', detail: err });
      }
    }

    return Response.json({ results, message: 'Sync Base → FFE completed' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});