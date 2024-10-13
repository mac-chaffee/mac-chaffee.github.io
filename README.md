# www.macchaffee.com

My personal website.

## Tech Stack

**Front-End**

Vanilla JS, CSS, and [Zola](https://www.getzola.org/).

**Back-End**

[pgs](https://pico.sh/pgs).

## Development Environment

Install Zola: <https://www.getzola.org/documentation/getting-started/installation/>

```
brew install zola
```

You can run `zola -r ./blog_zola serve -O` to view the site live.

## Deployment

Set up these pre-commit hooks:

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

cat > .git/hooks/pre-push << EOF
#!/usr/bin/env bash
set -Eeuo pipefail
rsync -rv index.html static blog movies _headers pgs.sh:/www
EOF

chmod +x .git/hooks/pre-push
```

Then the blog will be rebuilt automatically every time you run `git commit` and `rsync'd` every time you `git push`.

## Appendix: Initial setup on pgs.sh

To set up [pgs](https://pico.sh/pgs), first create DNS records in the zone `macchaffee.com`:

```
CNAME www -> pgs.sh.
TXT _pgs.www -> "mac-www"
CNAME @ -> pgs.sh.
TXT _pgs-> "mac-www-redirect"
```

Set up [redirects](https://pico.sh/pgs#redirect-www-to-naked-domain) for the zone apex:

```
echo "/*  https://www.macchaffee.com  301" > _redirects

rsync _redirects pgs.sh:/www-redirect
```

Upload the content:

```
rsync -rv index.html static blog movies _headers pgs.sh:/www
```
