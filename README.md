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

## Layouts

The template is based on small, content-agnostic partials that can be mixed and matched. The pre-built pages showcase just a few of the possible combinations. Refer to the `site/layouts/partials` folder for all available partials.

Use Hugo’s `dict` functionality to feed content into partials and avoid repeating yourself and creating discrepancies.

## CSS

The template uses a custom fork of Tachyons and PostCSS with cssnext and cssnano. To customize the template for your brand, refer to `src/css/imports/_variables.css` where most of the important global variables like colors and spacing are stored.

## SVG

All SVG icons stored in `site/static/media/icons` are automatically optimized with SVGO (gulp-svgmin) and concatenated into a single SVG sprite stored as a a partial called `svg.html`. Make sure you use consistent icons in terms of viewport and art direction for optimal results. Refer to an SVG via the `<use>` tag like so:

```
<svg width="16px" height="16px" class="db">
  <use xlink:href="#SVG-ID"></use>
</svg>
```
