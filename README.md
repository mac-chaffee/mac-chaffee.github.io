# macchaffee.com

My personal website.

## Tech Stack
**Front-End**

Vanilla JS, CSS, and [Zola](https://www.getzola.org/).

**Back-End**

Github Pages.

## Development Environment

Install Zola: <https://www.getzola.org/documentation/getting-started/installation/>

```
brew install zola
```

Make sure the oceanic-zen submodule is cloned into the `blog_zola/themes` directory.

You can run `cd blog_zola && zola serve -O` to view the site live.

## Deployment

```
cd blog_zola && zola build -o ../blog && cd -
git commit
git push
```
