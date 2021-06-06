import validateGithubToken from "./auth";
import { generateOptimizedVersion } from './optim';
import { getKeyFromRequestUrl, buildKey, hash, getMimeTypeFromRequest, getMimeTypeFromKey } from "./util";

addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

/**
 * KEY
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
      return request.arrayBuffer().then(data => {
        const storeOriginalPromise = store(data, getMimeTypeFromRequest(request));

        const storeWebpPromise = generateOptimizedVersion(data, "image/webp")
          .then(data => store(data, "image/webp"))
          .catch(() => null)

        const storeAvifPromise = generateOptimizedVersion(data, "image/avif")
          .then(data => store(data, "image/avif"))
          .catch(() => null)

        return Promise.all([storeOriginalPromise, storeWebpPromise, storeAvifPromise]).then(keys => {
          validKeys = keys.filter(k => k);
          return Promise.resolve(new Response(JSON.stringify(validKeys)));
        });
      });
    });
  }
}

function store(data, mimeType) {
  return hash(data).then(hash => {
    const key = buildKey(hash, mimeType);
    return MEDIA.put(key, data).then(() => key);
  });
}