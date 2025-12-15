export async function onRequest(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID in Cloudflare Pages settings", { status: 500 });
  }

  const redirectUrl = new URL("https://github.com/login/oauth/authorize");
  redirectUrl.searchParams.set("client_id", clientId);
  redirectUrl.searchParams.set("scope", "repo,user");
  
  return Response.redirect(redirectUrl.toString(), 302);
}
