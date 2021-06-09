# nsphoto2

Website for Nicole Schafer Photo & Film.

Built with Hugo & netlifycms. Hostable anywhere.
Authentication with GitHub using a Cloudflare Worker https://github.com/dr-useless/github-oauth


## Getting Started

### GitHub oauth with Cloudflare Worker
Create a GitHub oauth app.

Clone Cloudflare Worker repo: `git clone https://github.com/dr-useless/github-oauth`

Install wrangler `npm install -g wrangler`

Set secrets
- `wrangler secret put CLIENT_ID` enter the CLIENT_ID from your GitHub oauth app
- `wrangler secret put CLIENT_SECRET` enter the CLENT_SECRET from your GitHub oauth

### Hosting
I am using Cloudflare Pages, but you can also use Netlify, Render, or any other service for hosting static sites. A push to master should trigger a build & deploy.

## Local Development

Clone this repository, and run `yarn` or `npm install` from the new folder to install all required dependencies.

Then start the development server with `yarn start` or `npm start`.
