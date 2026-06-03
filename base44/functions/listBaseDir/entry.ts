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
    const dir = body.dir || 'src/pages';

    const res = await fetch(`https://api.github.com/repos/${BASE_REPO}/contents/${dir}`, { headers });
    if (!res.ok) {
      return Response.json({ error: `Dir not found: ${dir}`, status: res.status }, { status: 404 });
    }

    const data = await res.json();
    const files = data.map(f => ({ name: f.name, path: f.path, type: f.type }));

    return Response.json({ files });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});