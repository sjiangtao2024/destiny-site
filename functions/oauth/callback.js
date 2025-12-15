export async function onRequest(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code parameter", { status: 400 });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Cloudflare-Pages-Function"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const result = await response.json();

    if (result.error) {
      return new Response(JSON.stringify(result), { status: 400 });
    }

    const token = result.access_token;
    const provider = "github";

    // 返回一段 HTML JS，通知 CMS 窗口登录成功
    const body = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            
            // 发送消息给 CMS 窗口
            window.opener.postMessage(
              'authorization:${provider}:success:${JSON.stringify({
                token: token,
                provider: provider
              })}',
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          
          // 触发 CMS 握手
          window.opener.postMessage("authorizing:${provider}", "*");
        })();
      </script>
    `;

    return new Response(body, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
