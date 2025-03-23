+++
title = "Avoid building a security treadmill"
+++

Recently, a ticket came across my desk asking for help with stopping people from using a free GPU service to mine cryptocurrencies. The tool they requested to do this was [Falco](https://falco.org/docs/), an eBPF-powered agent that runs in a Kubernetes cluster, watching for suspicious syscalls using a set of rules. To detect cryptomining, [the default rules can detect outbound network connections to common miner pools](https://github.com/falcosecurity/rules/blob/371e43167e1b70ef0600d8fd30c8a338663ccb56/rules/falco-sandbox_rules.yaml#L1481) by watching the syscalls `sendto`, `sendmsg`, and `connect`. So I dutifully deployed Falco itself, plus [falcosidekick](https://github.com/falcosecurity/falcosidekick) which ingests all the Falco alerts, sends them to a Kafka cluster, then a Kafka consumer processes the events and kills the offending Kubernetes Pod.

The eye-watering complexity of this solution isn't even my main issue with it (it's not bad for a modern platform team). My issue is that it's a "security treadmill".

It's the oldest trick in the blogosphere book: giving a catchy name like "security treadmill" to a common phenomenon. A security treadmill<sup id="back-1">[1](#1)</sup> is a piece of software that, due to a weakness of design, requires constant patching to keep it secure. Isn't that just all software? Honestly... kinda, yeah, but a true treadmill is self-inflicted. You bought it, assembled it, and put it in your spare bedroom; a device specifically designed to let you walk/run forever without making forward progress.

When someone brought up the issue of people abusing the free GPUs to mine cryptocurrencies, the first question someone asked was: couldn't we just charge people for the GPUs? This could have been our first exit off the security treadmill. People don't mine cryptocurrencies because they like to run up your electric bill or embarrass your security team. They do it because it's profitable. If you charge people slightly more than the profit, they will just stop, no complicated infrastructure required. Tech-y people often forget that not every solution can be solved with more tech.

Anyway, the idea of removing the free service was abandoned for reasons I wasn't privy to, so we pressed ahead and deployed Falco. The demo worked, everyone seems happy for now, but I feel the ground moving ever so slowly backwards underneath me.

The problem should be apparent at this point to anyone who has tried to bypass an internet filter at school or work. There are countless ways to send network traffic to a particular host without needing to `connect` to its IP directly (the only way Falco can detect it). The security treadmill is now moving underneath us. To avoid falling off the back of it, we have to constantly update the Falco rules to catch new techniques, including such cutting-edge techniques like "using a VPN or proxy".

The failure mode that creates security treadmills is a failure to implement "secure by design" principles. The legacy of computing that we've all inherited is one built in the high-trust environment of collaborating universities in the 70's and 80's, where tools and protocols were not designed with security as a major factor. We have to shake off this mindset as we build new tools and protocols.

For example, the ability for nearly every application to have full, unfettered access to the entire Internet is a deeply-held and rarely-challenged assumption. Cryptocurrencies generally cannot be mined without a constant internet connection since you need to receive information about the latest "blocks". Denying all outbound network traffic except for a few allow-listed hosts would be one non-treadmill solution, with the added bonus of thwarting exfiltration attacks, 2-stage malware attacks, and command-and-control servers.

Another rarely-challenged assumption is that every application needs a full POSIX environment (like what a Docker container gives you): a read/write file system, ability to spawn other processes, ability to execute arbitrary code, [ability to read the memory of other processes](https://blog.cloudflare.com/diving-into-proc-pid-mem/#access-checks), [access to clocks with microsecond precision](https://developer.chrome.com/blog/meltdown-spectre/#high-resolution_timers), etc. Perhaps free-tier users of these GPUs could have been restricted to running specific demos, or restrictive timeouts for GPU processing times, or denying disk write access to prevent downloading miners, or denying the ability to execute files outside of a read-only area.

Given all these options, there are still lots of legacy applications that simply cannot be sandboxed and cannot be made sandboxable. But we can at least stop building new ones that require a never-ending security treadmill to keep them secured.

---

<aside>

<span id="1">1<span>[⤴](#back-1): Maybe a similar term could be a "security arms race", but security people have got to stop LARPing as if they in a war where everything is life or death. [Sun Tzu wouldn't like the cybersecurity industry](https://kellyshortridge.com/blog/posts/sun-tzu-wouldnt-like-the-cybersecurity-industry/) anyway.

</aside>
