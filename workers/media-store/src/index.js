import { MEDIA } from 'stylis';
import validateAuth from "./auth";
import { getKeyFromRequestUrl, getMimeTypeFromRequest, getMimeTypeFromKey, store } from "./util";

const cacheTtl = 604800; // 1 week

addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

/**
 * Each key has the following structure:
 * {id}:{mimeType}
 */

async function handle(request) {
  if (request.method === "OPTIONS") {
    const response = new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, PUT, OPTIONS",
        "access-control-allow-headers": "*",
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
          "content-length": data.byteLength,
          "cache-control": "immutable"
        }
      });
      return Promise.resolve(response);
    });
  }

  if (request.method === "PUT") {
    return validateAuth(reqest)
      .catch(() => Promise.resolve(new Response("Unauthorized", { status: 401 })))
      .then(() => {
        return request.arrayBuffer()
        .then(data => store(data, getMimeTypeFromRequest(request)))
        .then(key => {
          const requestUrl = new URL(request.url);
          const fetchUrl = `${requestUrl.protocol}//${requestUrl.host}/${key}`;
          return Promise.resolve(new Response(fetchUrl, {
            headers: {
              "access-control-allow-origin": "*",
              "content-type": "text/plain"
            }
          }));
        });
      });
  }

  return Promise.resolve(new Response("Method not allowed. Allowed methods: OPTIONS, GET, PUT", { status: 405 }));
}