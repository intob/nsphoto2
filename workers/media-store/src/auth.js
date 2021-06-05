const github_client_id = GITHUB_CLIENT_ID;
const github_client_secret = GITHUB_CLIENT_SECRET;

export default function validateGithubToken(token) {
  return fetch(
    `https://api.github.com/applications/${github_client_id}/token`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "cloudflare-worker-nsphoto-media-store",
        "accept": "application/vnd.github.v3+json",
        "authorization": buildAuthHeader()
      },
      body: JSON.stringify({ access_token: token })
    }
  ).then(response => response.status === 200);
}

function buildAuthHeader() {
  const credentials = btoa(`${github_client_id}:${github_client_secret}`);
  return `Basic ${credentials}`;
}