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

You can run `zola -r ./blog_zola serve -O` to view the site live.

## Deployment

Set up this pre-commit hook:

```bash
cat > .git/hooks/pre-commit << EOF
#!/usr/bin/env bash
set -Eeuo pipefail
cd \$(git rev-parse --show-toplevel)
zola -r ./blog_zola build -o ./blog --force &
zola -r ./movies_zola build -o ./movies --force &
wait
git add ./blog ./movies
EOF

chmod +x .git/hooks/pre-commit
```

Then the blog will be rebuilt automatically every time you run `git commit`.
