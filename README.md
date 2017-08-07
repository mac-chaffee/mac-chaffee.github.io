# macchaffee.com

My personal website

## Tech Stack
**Front-End**

Vanilla JS and Sass

**Back-End**

This is a static website, so it can be hosted directly from an AWS S3 bucket and cached easily by an AWS CloudFront CDN.

## Development Environment

**Dependencies:**
```
sudo apt install ruby ruby-dev
sudo gem install sass
npm install
```

**Serving the website:**

You can just open the index.html file, but then Chrome won't allow the service worker registration.
To avoid this, run `python -m SimpleHTTPServer 8000` and access the site at `localhost:8000`.

`npm run server` will do this for you.


**Re-compiling the stylesheets:**

```
sass -t compressed --watch sass/all.sass:css/styles.css
```

## Deployment

```
# Compile sass files, then Ctrl+C since we don't need to watch for changes.
npm run css

# Make sure the service worker is caching all files
npm run cache

# Upload everything to S3
npm run sync
```
