import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const REPO = 'OWNER/terra-nova-chronicles-Base'; // ← Remplacez OWNER par votre nom d'utilisateur/organisation GitHub

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');

    const url = new URL(`https://api.github.com/repos/${REPO}/issues`);
    url.searchParams.set('state', 'all');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('sort', 'updated');
    url.searchParams.set('direction', 'desc');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: err }, { status: response.status });
    }

    const issues = await response.json();
    return Response.json({ issues });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});