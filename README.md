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
```

**Serving the website:**

You can just open the index.html file, but then Chrome won't allow the service worker registration.
To avoid this, run `python -m SimpleHTTPServer 8000` and acceess the site at `localhost:8000`

**Re-compiling the stylesheets:**

```
sass -t compressed --watch sass/all.sass:css/styles.css
```
