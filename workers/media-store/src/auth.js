const github_client_id = GITHUB_CLIENT_ID;
const github_client_secret = GITHUB_CLIENT_SECRET;

export default function validateAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return Promise.reject();
  }
  const token = authHeader.replace("Bearer ", "");
  return validateGithubToken(token);
}

function validateGithubToken(token) {
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
  ).then(response => {
    if (response.status === 200) {
      return Promise.resolve();
    }
    return Promise.reject();
  });
}

function buildAuthHeader() {
  const credentials = btoa(`${github_client_id}:${github_client_secret}`);
  return `Basic ${credentials}`;
}