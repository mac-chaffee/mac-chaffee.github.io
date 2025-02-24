+++
title = "Deno shows us there's a better way"
draft = true
+++

This week, I completed a full rewrite of [my first personal project](https://gitlab.com/mac-chaffee/ncsu-menu-notifier), which was a Django project running on Heroku. Now it's a Deno project running on Deno Deploy. The experience has really gotten me thinking about the amount of pain we put up with to deploy simple stuff these days, especially with containers. Deno shows us that it doesn't have to be that way.

I know what you're thinking, "we already had a great setup: rsyncing PHP files". Unfortunately, rsyncing PHP files still lacks many critical features needed for more complicated projects. Collaboration, continuous integration, dependency management, multi-region support, scalability, preview environments, runtime security are just some of the features you'd have to build yourself. That's part of why containerization (and its ecosystem) has taken off, since it provides a well-trodden path for each of those features ("just a few more CNCF projects and we can really get this thing poppin'")

But people have been saying for a long time that containers are painful to work with. Historically I've been a bit dismissive of those people because, like all technology, containers make tradeoffs. You have to tolerate the slow build times, bloated images, and YAML hell in order to get the language agnosticism, dependency bundling, immutability, and access to Kubernetes and other projects that give your app superpowers as long as it's containerized. At least, that's what I used to believe.
