import validateGithubToken from "./auth";
import { getKeyFromRequestUrl, getMimeTypeFromRequest, getMimeTypeFromKey, store } from "./util";

addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

/**
 * Each key has the following structure:
 * {id}:{mimeType}
 */

async function handle(request) {
  if (request.method !== "OPTIONS" && request.method !== "GET" && request.method !== "PUT") {
    return Promise.resolve(new Response("Method not allowed. Allowed methods: OPTIONS, GET, PUT", { status: 405 }));
  }

  if (request.method === "OPTIONS") {
    const response = new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, PUT, OPTIONS",
        "access-control-max-age": 1728185
      },
    });
    return Promise.resolve(response);
  }

  if (request.method === "GET") {
    const key = getKeyFromRequestUrl(request.url);
    if (!key) {
      return Promise.resolve(new Response("Not found", { status: 404 }));
    }
    return MEDIA.get(key, {type: "arrayBuffer"}).then(data => {
      if (!data) {
        return Promise.resolve(new Response("Not found", { status: 404 }));
      }
      const response = new Response(data, {
        status: 200,
        headers: {
          "content-type": getMimeTypeFromKey(key),
          "content-length": data.byteLength
        }
      });
      return Promise.resolve(response);
    });
  }

  if (request.method === "PUT") {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return Promise.resolve(new Response("Unauthorized", { status: 401 }));
    }
    const token = authHeader.replace("Bearer ", "");             
    return validateGithubToken(token).then(isAuthenticated => {
      if (!isAuthenticated) {
        return Promise.resolve(new Response("Unauthorized", { status: 401 }));
      }
      return request.arrayBuffer()
      .then(data => store(data, getMimeTypeFromRequest(request)))
      .then(key => {
        const requestUrl = new URL(request.url);
        const responseBodyObject = {
          key: key,
          url: `${requestUrl.protocol}//${requestUrl.host}/${key}`
        }
        return Promise.resolve(new Response(JSON.stringify(responseBodyObject)))
      });
    });
  }
}