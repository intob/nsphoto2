addEventListener("fetch", (event) => {
	event.respondWith(handle(event.request));
});

// use secrets
const client_id = CLIENT_ID;
const client_secret = CLIENT_SECRET;
const origin = ORIGIN;

async function handle(request) {
	// handle CORS pre-flight request
	if (request.method === "OPTIONS") {
		return new Response(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			}
		});
	}

	// redirect GET requests to the OAuth login page on github.com
	const { searchParams } = new URL(request.url)
	const code = searchParams.get('code')

	if (request.method === "GET" && !code) {
		return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo%20read:user`, 302);
	}

	try {
		const response = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
					"user-agent": "cloudflare-worker-github-oauth",
					"accept": "application/json"
				},
				body: JSON.stringify({ client_id, client_secret, code })
			}
		);
		const result = await response.json();
		const headers = {
			"content-type": "text/html;charset=UTF-8",
			"Access-Control-Allow-Origin": "*",
		};

		if (result.error) {
			return new Response(JSON.stringify(result), { status: 401, headers });
		}

		const content = {
			token: result.access_token,
			provider: "github"
		}

		const script = `
		<html>
			<body>
				<p>Authorizing...</p>
			</body>
			<script>
				(function() {
					function recieveMessage(e) {
						if (!e.origin.match('${origin}')) {
							return;
						}
						window.opener.postMessage(
							'authorization:github:success:${JSON.stringify(content)}',
							e.origin
						);
					}
					window.addEventListener('message', recieveMessage, false);
					window.opener.postMessage('authorizing:github', '*');
				})()
			</script>
		</html>`

		return new Response(script, {
			status: 200,
			headers
		});
	} catch (error) {
		console.error(error);
		return new Response(error.message, {
			status: 500,
		});
	}
}