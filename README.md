# macchaffee.com

My personal website

## Tech Stack
**Front-End**

Vanilla JS, Sass, and Jekyll

**Back-End**

This is a static website, so it can be hosted directly from an S3 bucket + CloudFront.

## Development Environment

**Dependencies**
```
sudo apt install ruby ruby-dev
export GEM_HOME=$HOME/.gems
gem install sass jekyll bundle

cd blog_jekyll
bundle install
```

**Updating Dependencies**
```
cd blog_jekyll
bundle update
```
If updating a dependency pinned in the `Gemfile`, you'll need to
manually update the value afte running `bundle update`.

**Auto-recompile**

Run `./run dev` to watch for css changes, blog changes, and start the server.

**Serving the website**

You can just open the index.html file, but then Chrome won't allow inlineSVG to work.
To avoid this, run `python3 -m http.server 8000` and access the site at `localhost:8000`.

`./run server` will do this for you.


**Re-compiling the stylesheets**

```
sass -t compressed --watch sass/all.sass:css/styles.css
# or just this:
./run css
```

## Deployment

```
# Re-generate the css, the blog, and upload everything to S3
./run sync
```
