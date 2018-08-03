# macchaffee.com

My personal website

## Tech Stack
**Front-End**

Vanilla JS, Sass, and Jekyll

**Back-End**

This is a static website, so it can be hosted directly from an S3 bucket + CloudFront.

## Development Environment

**Dependencies:**
```
sudo apt install ruby ruby-dev
export GEM_HOME=$HOME/.gems
gem install sass jekyll bundle

cd blog_jekyll
bundle install

cd ..
npm install
```

**Auto-recompile**

Run `npm run dev` to watch for css changes, blog changes, and start the server.

**Serving the website:**

You can just open the index.html file, but then Chrome won't allow the service worker registration.
To avoid this, run `python -m SimpleHTTPServer 8000` and access the site at `localhost:8000`.

`npm run server` will do this for you.


**Re-compiling the stylesheets:**

```
sass -t compressed --watch sass/all.sass:css/styles.css
# or just this:
npm run css
```

## Deployment

```
# Re-generate css, re-cache, and upload everything to S3
npm run sync
```
