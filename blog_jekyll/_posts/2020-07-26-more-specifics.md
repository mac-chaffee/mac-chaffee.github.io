---
layout: post
title:  "Please make your advice more specific"
date:   2020-07-26 10:03:08 -0400
image:  /assets/2020-07-26-cargo_cult.jpg
---

To those of you who give advice on which languages, methodologies, architectures, or whatever else to use, I want to start by saying thank you. Your advice is vital to the growth of millions of people like me who are early in their careers.

But I've noticed a pattern with software engineering advice that leads to over-engineering and unnecessary arguments. So I have a request:

<p align="center"><em>Please make your advice more specific</em></p>

It's too often overlooked that there isn't just one type of "software", thus it is rare for advice to be applicable to every situation. For example, advice for testing a small B2B web app might not work for embedded device firmware. But it might work for a large B2C web app. And since your readers won't have experience in all of those situations, could we all start being more explicit about the applicability of our advice?

Being more specific might help address two big time sinks in the industry:
1. [Cargo-culting](https://en.wiktionary.org/wiki/cargo_culting), like when people read how great Kubernetes works for Netflix, but then they decide use it for a little Django app (that was me a few years ago).
2. [Bikeshedding](https://en.wiktionary.org/wiki/bikeshedding), like when people argue incessantly that a language is useless because it can't be used in some niche.

A good start might be answering questions like the following for users:
* Does your advice apply to my scale? (local restaurant website vs. Youtube.com)
* Does your advice apply to my type of product? (library, web app, CLI tool, firmware, on/off-premise, etc.)
* Does your advice apply to my type of users? (developers, enterprises, regular people, etc.)
* If not, what should I use instead? (like [replacing Hadoop with `find/xargs/awk`](https://adamdrake.com/command-line-tools-can-be-235x-faster-than-your-hadoop-cluster.html))

Of course, it's hard to find the right balance between hand-holding readers or just saying "buyer beware". But hopefully spending time to add an extra subheading on "Applicability" to READMEs or blog posts will pay for itself in time spent over-engineering and arguing over minutiae.
