---
layout: post
title:  "The design decisions behind my personal website"
date:   2017-09-15 19:56:08 -0400
image:  ../static/favicon.png
---

I believe there are three things that make a good personal site:

1. Good SEO
   * This includes some technical things like [page speed][1] and [HTTPS][2]
2. Easy to develop and update
3. Cheap to host

I tried to accomplish these three goals when making this site. You can
find the source code [here][3].

## Backend

Web development has made a lot of progress since the early stages of the internet.
We have more choices than ever, but bar none, the fastest and cheapest websites
are *static*. That means the web server sends files exactly as they are stored,
so there's minimal overhead involved in processing each request. Static pages
can also be heavily cached to further reduce loading time and hosting costs.
A static website is the obvious choice here.

One not-so-obvious choice is where to host static sites. GitHub Pages and many
other sites will do it for free, but they sandbox you in many ways. I wanted full
control over my website, so I used Amazon Web Services. They have [a good guide][4]
on how to set up an S3 bucket to act as a static web host. This method is not free,
but it's still extremely affordable. My first month's bill would have been <$0.03 if
not for Amazon waiving that cost for the first year.

## Frontend

I wanted to keep everything simple.
I opted for [Sass][5] to simplify my css and [jekyll][6] since it's only real option for static blogs.
Sass allows me to do stuff like this:
{% highlight sass %}
// Draws the red traversal line at macchaffee.com
$map: (github: 673, gitlab: 533, blog: 292, resume: 155)

@each $key, $val in $map
  &.#{$key}
    stroke-dashoffset: #{$val}
{% endhighlight %}

And jekyll allows me to add syntax highlighting to that code snippet.

Aside from HTML, CSS, and JS linters, I managed to only need two JavaScript libraries: [inlineSVG][7]
and [sw-precache][8]. SVGs in separate files can't be modified with JS or CSS unless you use iframes
(gross) or something like inlineSVG.

sw-precache is a neat library from the Google Chrome team that leverages [service workers][9]
to cache an entire website on a user's computer in the background.
This is extremely beneficial to me since it greatly reduces the number of requests to S3,
saving me money. It's also beneficial to the user since they get impossibly fast loading times
and the site is available offline. At the time of writing, the total cache size is only 231kB.

{% include image.html name="2017-09-16-pagespeed.png"
  alt="Page speed for macchaffee.com"
  caption="The service worker itself is cached for 30 seconds using http headers" %}

## Development

This is an area that could use some improvements. I need a better build manager than just
putting stuff under "scripts" in my package.json file. But now that I have some clever
commands in there, I can simply say `npm run dev` to start the jekyll transpiler, the sass
transpiler, and a web server.

I use [Atom][10] (hence the color scheme of this blog) and it has good support for linters.
I use [eslint][11], [htmlhint][12], and [sass-lint][13] to catch errors early. These linters run in the background
automatically whenever I save a file.

But overall, because I made a concerted effort to reduce complexity and dependencies, this
site will be easier to maintain in the future.


[1]: https://webmasters.googleblog.com/2010/04/using-site-speed-in-web-search-ranking.html
[2]: https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html
[3]: https://github.com/mac-chaffee/personal-site
[4]: http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html
[5]: http://sass-lang.com/
[6]: https://jekyllrb.com/
[7]: https://github.com/jonnyhaynes/inline-svg
[8]: https://github.com/GoogleChrome/sw-precache
[9]: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
[10]: https://atom.io/
[11]: https://github.com/eslint/eslint
[12]: https://github.com/yaniswang/HTMLHint
[13]: https://www.npmjs.com/package/sass-lint
