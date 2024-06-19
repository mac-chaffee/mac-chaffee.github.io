# macchaffee.com

My personal website.

## Tech Stack
**Front-End**

Vanilla JS, CSS, and [Zola](https://www.getzola.org/).

**Back-End**

GitHub Pages.

## Development Environment

Install Zola: <https://www.getzola.org/documentation/getting-started/installation/>

```
brew install zola
```

You can run `cd blog_zola && zola serve -O` to view the site live.

## Deployment

```
cd blog_zola && zola build -o ../blog --force && cd -
git commit
git push
```
