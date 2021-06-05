const imageOptimizerAddress// = IMAGE_OPTIMIZER_ADDRESSS;
const imageOptimizerAuth// = IMAGE_OPTIMIZER_AUTH;

export function generateOptimizedVersion(data, sourceType, targetType) {
  return fetch(imageOptimizerAddress,
    {
      method: "POST",
      headers: {
        "content-type": sourceType,
        "user-agent": "cloudflare-worker-nsphoto-media-store",
        "accept": targetType,
        "authorization": `Bearer ${imageOptimizerAuth}`
      },
      body: data
    });
}