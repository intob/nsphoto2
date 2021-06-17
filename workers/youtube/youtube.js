addEventListener("fetch", event => {
	event.respondWith(handle(event.request));
});

async function handle(request) {
	const url = new URL(request.url);
	return fetch(`https://img.youtube.com/${url.pathname}`)
		.then(response => response.arrayBuffer())
		.then(data => {
			return new Response(data, {
				headers: {
					"access-control-allow-origin": "*"
				}
			})
		});
}