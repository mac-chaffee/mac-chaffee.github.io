+++
title = "Book Review: Security Chaos Engineering"
date = 2023-08-03
+++

I recently picked up a few books to read, and *[Security Chaos Engineering](https://www.securitychaoseng.com)* engrossed me so significantly that it 1) made me read the whole thing and 2) made me want to write about it too!

If you just want a taste of the book, check out the primary author [Kelly Shortridge's blog](https://www.kellyshortridge.com/). Her unique writing style is quite fun to read.

My interpretation of the book was that it is the InfoSec world's equivalent of the *Ninety-five Theses*, pointing out the various ways that the security practices of the past and present have failed us all. Since these failures are so normalized, it's impressive seeing Shortridge traverse the entire org chart and tech stack, pointing out all the pain points I've always felt, but never thought too much about. The chaos engineering stuff plays a minor role, more just a natural conclusion from the radical idea (/s) that we should not just assume things about the security of our systems; we should test them.

The way I interpreted the book is informed by my own background in tech, which I would describe as "software engineer turned DevOps person, with a healthy interest in security". That "healthy interest in security" is the dangerous part, because I know just enough to be frustrated at the state of the security industry, but not enough to personally do anything about it. A book like *SCE* makes me start to think that maybe that frustration isn't unfounded.

I took away two super key points that I think warrant me re-iterating them here in my own words, just to get the message out.

## Point 1: Resilience over robustness

Much time and energy has been poured into security practices that restrict, block, and control. This has largely been viewed as a necessary evil of security, but it's not nearly as necessary as many security people would lead you to believe.

*SCE* explains this by making a distinction between resilience (adapting around attacks) and robustness (trying to stop attacks). The classic example from Aesop's fable is how a robust oak tree stands in proud resistance against the wind, but it ultimately falls while the resilient reeds flex and bend.

A good example is a Web Application Firewall (WAF), which runs thousands of regexes on every HTTP request to block requests that like look like they contain SQL queries or shell commands. As you can imagine, [they aren't good at their job](./2023-11-11-wafs.md), causing many false positives, slowing down websites, and still being easily circumventable by attackers. That doesn't stop infosec teams from requiring you to use WAFs, unfortunately. A WAF gives you robustness, not resilience.

Resilience would involve securing your websites "by design", like using static analysis to prevent passing user-controlled input into shell commands or to enforce the use of prepared statements. Choosing resilience would also mean taking all that time you save in chasing down false-positives and investing it planning for the eventuality that an attacker bypasses your defenses anyway. That could mean doing drills, double-checking backup procedures, and monitoring/learning from past incidents.

## Point 2: Your security team should be more like platform engineers

To state the obvious, securing a server, laptop, or a piece of software is hard. It requires a unique skill-set that not everyone in your organization possesses. Why then do we expect them to know as much, care as much, and do as much about security as a CISO?

Platform engineering grew out of a parallel problem: that software has become so complex to deploy and operate that it requires a dedicated subfield. But merely creating separate "dev" and "ops" teams creates bad outcomes, since "ops" tends to gatekeep the "devs" and neither team is motivated to cooperate with each other. Platform engineering re-balances the power held by "ops" by forcing it to serve the interests of the "devs". Devs are the customers for whom the "platform" is the product being sold. No one will buy a hard-to-use, featureless, unstable product (well unless you have name recognition...). Thus the platform engineering team has to create tools and libraries that the devs will *want* to use.

Likewise, *SCE* extols the benefits of applying those same principles to your security team. Rather than letting them be the disinterested gatekeepers that they typically are, make them serve the organization by running them like a platform engineering team. They should be building and choosing security tools that the organization will *want* to use, rather than taking some twisted pleasure in forcing through increasingly onerous policies.

Without that drive to serve the organization, security teams often build up a hostile relationship with their own organizations (which itself is a security risk!).

<figure>
  <img src="/blog/2023/cisa_pizza_party.png" alt="A picture of CISA's Cybersecurity Checklist which encourages scheduling a pizza party to improve relationships between your security team and your operations teams."/>
  <figcaption><em>As if pizza can solve a deep-seated structural issue such as this...</em></figcaption>
</figure>

CEOs are torn between investing more in the very-real threats of cyber attacks, but not wanting to sacrifice the efficacy of their organization in the process. Traditional security teams cause that dilemma, but a platform engineering security team would make it go away. As long as executives merely *think* that dilemma exists, cybersecurity will never get the amount of attention it needs.

I don't think it's a coincidence that the skills required to be on a security platform engineering team are nothing like the skills you learn in your average InfoSec MBA program. You'd need something more similar to software engineering skills, which means the resulting security tools are better quality (not just some "enterprise" monitoring agent that says the right buzzwords) and communication is easier (none of those incomprehensible compliance checklists).

## Conclusion

My one complaint with the book is that it feels a bit more aspirational than practical. But damn if it doesn't sound like an amazingly promising aspiration: a security industry that achieves *real* security, and they actually help you get there.

Seeing the book point out all the obvious (in hindsight) ways that the security status quo is ineffective almost makes me fear working in the cybersecurity field. How come all the people in power in the cybersecurity field can't see this mess they've created? If I joined them, would I be forced to keep propping up this status quo? I hope one day soon that the cybersecurity industry starts doing the one thing they can't stand: change.
