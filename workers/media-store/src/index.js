import validateAuth from "./auth";
import { getKeyFromRequestUrl, getMimeTypeFromRequest, getMimeTypeFromKey, store } from "./util";

export const keyTtl = 15552000; // 6 months in s
const refreshThreshold = 7776000000; // 3 months in ms
const kvCacheTtl = 3600; // 1 hour in s
const clientCacheTtl = 5259600; // 2 month in s

addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

/**
 * Each key has the following structure:
 * {id}:{mimeType}
 */

async function handle(request) {
  if (request.method === "GET") {
    const key = getKeyFromRequestUrl(request.url);
    if (!key) {
      return Promise.resolve(new Response("Not found", { status: 404 }));
    }
    return MEDIA.getWithMetadata(key, {type: "arrayBuffer", cacheTtl: kvCacheTtl})
      .then(valueWithMetadata => {
        const data = valueWithMetadata.value;
        const metadata = valueWithMetadata.metadata;
        if (!data) {
          return Promise.resolve(new Response("Not found", { status: 404 }));
        }

        let refreshPromise;
        if (metadata && metadata.expires < Date.now() + refreshThreshold) {
          refreshPromise = store(data, getMimeTypeFromKey(key), true);
        } else {
          refreshPromise = Promise.resolve();
        }

        return refreshPromise.then(() => {
          const clentResponse = new Response(data, {
            status: 200,
            headers: {
              "content-type": getMimeTypeFromKey(key),
              "content-length": data.byteLength,
              "cache-control": `immutable, max-age=${clientCacheTtl}`
            }
          });

          const cacheResponse = new Response(data, {
            status: 200,
            headers: {
              "content-type": getMimeTypeFromKey(key),
              "content-length": data.byteLength,
              "cache-control": `max-age=${clientCacheTtl}`
            }
          });

          return caches.default.put(request, cacheResponse)
            .then(() => Promise.resolve(clentResponse));
        });
      });
  }

  if (request.method === "PUT") {
    return validateAuth(request)
      .catch(() => Promise.resolve(new Response("Unauthorized", { status: 401 })))
      .then(() => {
        return request.arrayBuffer()
          .then(data => {
            return store(data, getMimeTypeFromRequest(request));
          })
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

  if (request.method === "DELETE") {
    return validateAuth(request)
      .catch(() => Promise.resolve(new Response("Unauthorized", { status: 401 })))
      .then(() => {
        const key = getKeyFromRequestUrl(request.url);
        if (!key) {
          return Promise.resolve(new Response("Not found", { status: 404 }));
        }
        return MEDIA.delete(key)
          .then(() => Promise.resolve(new Response("Done", { status: 200 })));
      });
  }

  if (request.method === "OPTIONS") {
    const response = new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "*",
        "access-control-max-age": 1728185
      },
    });
    return Promise.resolve(response);
  }

  return Promise.resolve(new Response("Method not allowed. Allowed methods: OPTIONS, GET, PUT, DELETE", { status: 405 }));
}