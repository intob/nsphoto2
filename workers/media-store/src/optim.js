const nodeSharpApiAddress = NODE_SHARP_API_ADDRESS;
const nodeSharpApiAuth = NODE_SHARP_API_AUTH;

export function generateOptimizedVersion(data, targetType) {
  console.log(data.byteLength);
  let formData = new FormData();
  formData.append("input-element", new Blob([data], {type:"image/jpeg"}), new Date().toJSON() + ".jpg");
  return fetch(nodeSharpApiAddress,
    {
      method: "POST",
      headers: {
        "user-agent": "cloudflare-worker-nsphoto-media-store",
        "accept": targetType,
        "authorization": `Bearer ${nodeSharpApiAuth}`
      },
      body: formData
    }).then(response => {
      console.log(response.status);
      if (response.status !== 200) {
        return Promise.reject();
      }
      return response.arrayBuffer()
    });
}