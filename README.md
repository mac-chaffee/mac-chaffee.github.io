# macchaffee.com

My personal website

## Tech Stack
**Front-End**

Vanilla JS, CSS, and Jekyll

**Back-End**

This is a static website, so it can be hosted directly from an S3 bucket + CloudFront.

## Development Environment

**Dependencies**
```
sudo apt install ruby ruby-dev
export GEM_HOME=$HOME/.gems
gem install jekyll bundle

cd blog_jekyll
bundle install
pip install --user awscli
aws configure
```

**Updating Dependencies**
```
cd blog_jekyll
bundle update
```
If updating a dependency pinned in the `Gemfile`, you'll need to
manually update the value after running `bundle update`.

**Auto-recompile**

Run `./run dev` to watch for css changes, blog changes, and start the server.

## Deployment

This command will recompile the blog then upload everything to S3:
```
./run sync
```
