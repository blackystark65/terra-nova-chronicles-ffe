import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_REPO = 'blackystark65/terra-nova-chronicles-Base';

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
    };

    const body = await req.json();
    const { filePath } = body;

    if (!filePath) {
      return Response.json({ error: 'filePath required' }, { status: 400 });
    }

    const res = await fetch(`https://api.github.com/repos/${BASE_REPO}/contents/${filePath}`, { headers });
    if (!res.ok) {
      return Response.json({ error: `File not found: ${filePath}`, status: res.status }, { status: 404 });
    }

    const data = await res.json();
    // Décoder le contenu base64
    const content = atob(data.content.replace(/\n/g, ''));

    return Response.json({ content, sha: data.sha, path: filePath });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});