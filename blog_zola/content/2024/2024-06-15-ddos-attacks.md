+++
title = "DDoS attacks can threaten the independent Internet"
+++

Back in January [SourceHut and Codeberg both experienced a distributed denial of service (DDoS) attack](https://news.ycombinator.com/item?id=38959762). That attack made me worried about the future of the small, independent Internet: services like SourceHut and Codeberg which do not use the oligopoly of large hosting providers.

DDoS attacks are where an attacker controls a bunch of computers (usually a botnet of hacked devices with residential IPs) and directs every computer to send traffic to a target set of servers, knocking the target offline. Attackers might use amplification methods or exploit vulnerable protocols (like [Rapid Reset](https://blog.cloudflare.com/technical-breakdown-http2-rapid-reset-ddos-attack/) in HTTP2), but let's set those aside. I'm talking about the simplest case of a couple thousand IoT toasters sending millions of packets per second to your server.

If you are at the receiving end of an attack like that, you can no longer participate in the small, independent Internet. You are forced to seek shelter behind a large enterprise with enough capital to afford the hardware and software to absorb the attack. Bigger attacks require using a bigger provider. Some providers have decent economies of scale to amortize the cost of DDoS protection (OVH), but others may charge you exorbitantly, much more than a single individual can afford.

The heads of big cloud providers are not democratically elected. Their terms of service aren't written by the people, for the people. There are no checks and balances for their actions. But the fact remains that the only real mitigation against a DDoS attack is to hide behind a big expensive server run by one of these providers.

This is pretty scary to me. Lots of groups from home labbers to grassroots movements need the ability to put services on the Internet, but do not have the ongoing income to rent cloud servers plus associated DDoS protection. Others don't even have the option of using cloud-based products due to the risks of de-anonymization (this is your daily reminder that [the FBI tried to get MLK killed](https://en.wikipedia.org/wiki/FBI%E2%80%93King_suicide_letter)), export controls, or terms of service violations.

Seems that participants of the small, independent Internet largely ignore the threat of a DDoS attack, until the moment one happens. A DDoS attack on an artist's portfolio site is probably not useful, but if you instead target a Matrix instance used during a protest, or an informative site with stuff a despotic government doesn't like, you can completely debilitate those. Like I said: pretty scary.

## Why not just use Cloudflare/Akamai/Fastly lol?

Let's say you aren't likely to be blackmailed by the FBI or kicked off the platform and you have easy access to a credit card. Why not just use Cloudflare/Akamai/Fastly?

These providers all work essentially the same way. They use a proprietary algorithm that allegedly does a good job of differentiating "good" traffic from "bad" traffic. Then they drop all the "bad" traffic and block the sender IPs (with a CAPTCHA) for an unknown amount of time. But this approach has a considerable drawback that is never discussed in the breathlessly-positive blog posts that these companies pump out: false-positives are common, catastrophic, and negligently ignored.

At the scale Cloudflare/Akamai/Fastly operate, "rare" events like a single-digit false-postive rate can affect thousands of people who have no recourse. Each of these companies serves so many websites that [getting on their "naughty list" can have devestating consequences to your ability to use the internet, with no recourse](https://www.ctrl.blog/entry/cloudflare-ip-blockade.html). Sure you can solve CAPTCHAs to get through, but many apps and websites make background HTTP requests which will simply fail if they receive a CAPTCHA page in the response body.

To make matters worse, we don't even know the false-positive rates of these companies. It's not even possible to know since there is no "ground truth" for whether a given blocked IP address was being used by a real person or a botnet node (or it could be both on the same NAT'd network). When a company blog post says they "mitigated" some super large DDoS attack, there is literally no way to know how many innocent bystanders were also blocked in the process.

We need DDoS solutions that are not stochastic torture devices.

## Then what do we do?

Here's the part of my post where I'd normally point to some lesser-known but promising effort to solve the problem, but sadly I don't see one for DDoS attacks. Usually the real solutions are easy to find: all the CDN providers and DDoS scrubbing services are certainly not interested in fully solving the problem, because they'd lose a lot of money. So usually there are community- or university-driven efforts that actually solve the problem. But I didn't see much. Seems this problem's a tough nut to crack.

Two things do exist, but they're not real solutions in my opinion:

1. Forcing clients to do proof-of-work stuff: Obviously not a solution since this is backwards-incompatible with every networking-enabled device on the planet.
2. [DDoS Open Threat Signaling](https://wiki.ietf.org/group/dots) (DOTS): An IETF RFC which standardizes the architecture for how servers can share IP/proto/port block-lists. A nice thing to have so that every DDoS protection company doesn't go invent their own proprietary thing, but doesn't fundamentally solve the problem of DDoS attacks.

If I had to think of a solution off-the-cuff, maybe an extension to DOTS that allows setting (and dynamically changing) max flow rates. Like "this IP:port is a tiny email server, so tell every ISP that if they see more than 10 different source IPs flowing to me in one second I'm probably being DDoS'd". I dunno.

Unfortunately I'm not seeing anything else. If you work in this space, please prove me wrong!
