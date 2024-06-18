+++
title = "We've STILL learned nothing from the SolarWinds hack"
draft = true
+++

Last year I wrote [a retrospective](@/2023/2023-05-21-solarwinds-hack-lessons-learned.md) on the [2020 SolarWinds hack](https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach). It's suddenly relevant again because [a ProPublica article](https://www.propublica.org/article/microsoft-solarwinds-golden-saml-data-breach-russian-hackers) recently came out which tells us much more about Microsoft's involvement, something which I neglected to mention in my original post.

Initial reporting did mention Microsoft tech was involved, so I'm not sure how much new info is in this ProPublica article. But it does tell a compelling and all-too-common story about greed taking precedence over security.

The article mainly focuses on Andrew Harris' 2016 discovery of an attack that was later dubbed "Golden SAML" and his lengthy battle with other Microsoft employees who didn't seem to take it seriously. You see, Microsoft was trying to land a big juicy government contract and beat competitors, and couldn't spare *any* of their 200,000+ employees to work on this pesky little issue.

About three years later, that little issue was instrumental in one of the biggest breaches in history, then Microsoft landed that contract, and then their stock price soared.

Suffice to say, we still have a lot to learn. There are some obvious lessons, but my list of lessons below are just some disjointed personal gripes.

## Lesson 1 - Build security in, since sometimes it can't be bolted on

The initial design of ADFS probably dates back to [before 2003](https://en.wikipedia.org/wiki/Active_Directory_Federation_Services) which feels like a long enough time ago for Microsoft to claim they couldn't have known better. A 2019 supply chain attack feels so modern, and Microsoft is [famously allergic to breaking backwards compatibility](https://softwareengineering.stackexchange.com/q/359914). But reading this document from 2003 called "[The National Strategy to Secure Cyberspace](https://en.wikipedia.org/wiki/National_Strategy_to_Secure_Cyberspace)", it's not like "secure by design" wasn't invented yet:

> The Nation must seek to ensure that future components of the cyber infrastructure are built to be inherently secure and dependable for their users.

> Some new technologies introduce security weaknesses that are only corrected over time, with great difficulty, or sometimes not at all.

I'm no Windows expert, but my understanding of the Golden SAML attack ([as demo'd by Harris himself](https://www.ciberesponce.com/solarwinds/)) is that the first step of the attack requires access to a highly-privileged service account, such as one used for patching domain controllers.



I'm sure ADFS has been redesigned a few times since then, but . In the ProPublica article, Harris proposes a solution that unfortunately makes users log in twice, a minor breaking of compatibility that was apparently too much for Microsoft to bear.



## Lesson 2 - Take security seriously, but don't be unskeptical

I love how well-written the ProPublica article is and I appreciate that its message is a clear and necessary call-to-action: Take security more seriously. Companies still see security as a thing that is only useful for tricking more customers into buying their garbage. Which means business needs will always eventually win over security needs. Without legal requirements, this won't change.

The internet is already full of content (mainly from crappy security companies) saying "take security seriously", so I won't belabor that point. Instead I'll add an adddendum: "take security seriously, but don't be unskeptical".

The security industry can be a lucrative field where its practicioners do not have to undergo any standard training (unlike doctors or lawyers) but can demand high salaries and expansive authority. It's also a rapidly-growing $200+ billion dollar industry. This combination of dumb money, high demand, high authority, and low barrier to entry means the security industry attracts incompetant grifters and egotistical powertrippers. It also attracts smart and talented techies who want to make the world safer. Until the security industry figures out a way to [professionalize](https://en.wikipedia.org/wiki/Professionalization) and kick out the grifters, you'll have to learn how to tell the difference on your own.

## Lesson 3 - Some features can literally never be secure and should just not exist

Talk about the conflict between expanded synergy between products and expanding attack surface.
