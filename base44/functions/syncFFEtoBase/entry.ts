import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_REPO = 'blackystark65/terra-nova-chronicles-Base';
const FFE_REPO = 'blackystark65/terra-nova-chronicles-ffe';

// Fichiers FFE plus avancés que Base (identifiés par comparaison de SHAs)
const FILES_TO_SYNC = [
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
      // 1. Lire le contenu depuis FFE
      const ffeRes = await fetch(`https://api.github.com/repos/${FFE_REPO}/contents/${filePath}`, { headers });
      if (!ffeRes.ok) {
        results.push({ file: filePath, status: 'error', detail: `FFE read failed: ${ffeRes.status}` });
        continue;
      }
      const ffeData = await ffeRes.json();
      const content = ffeData.content; // base64 encodé

      // 2. Lire le SHA actuel dans Base (pour le update)
      const baseRes = await fetch(`https://api.github.com/repos/${BASE_REPO}/contents/${filePath}`, { headers });
      let baseSha = null;
      if (baseRes.ok) {
        const baseData = await baseRes.json();
        baseSha = baseData.sha;
      }

      // 3. Si même SHA → skip
      if (baseSha && baseSha === ffeData.sha) {
        results.push({ file: filePath, status: 'skipped', detail: 'identical' });
        continue;
      }

      // 4. Pousser vers Base
      const body = {
        message: `sync: apply FFE improvements to ${filePath}`,
        content: content,
        ...(baseSha ? { sha: baseSha } : {}),
      };

      const pushRes = await fetch(`https://api.github.com/repos/${BASE_REPO}/contents/${filePath}`, {
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

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});