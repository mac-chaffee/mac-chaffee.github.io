+++
title = "We've learned nothing from the SolarWinds hack"
date = 2023-05-21
+++

Back in 2020, A Russian state-sponsored group got into SolarWinds' build system and inserted  command and control (c2) code into a routine software update for a network monitoring tool called Orion ([wiki link](https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach)). It was all over the news, and for good reason given the extent of the breach (into particularly sensitive parts of the US government) and the lengthy recovery process [which will likely take years](https://www.businessinsider.com/russia-hack-may-take-years-undo-bossert-2020-12). Given its high profile, I'm shocked to report that I feel very little has been learned from that attack.

To me, the hack was a wake-up call about how the way we install and run software is insecure by design and needs a rework, maybe using [capabilities-based security](https://en.wikipedia.org/wiki/Capability-based_security). But all I hear about is a bunch of solutions that kinda miss the point. Let's go over all of those first.

## "We should sign and verify all our dependencies"

In the wake of the SolarWinds hack, interest in "securing the software supply chain" grew considerably, including [a May 2021 executive order](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity) telling NIST/CISA to develop some guidelines about the subject. The [Supply-chain Levels for Software Artifacts (SLSA)](https://slsa.dev/) framework also launched that same year and has been steadily growing in popularity.

Don't get me wrong: I appreciate the extra interest in this area. However, the fact remains that malicious code can be signed and verified too, depending on how deeply in the supply chain the attackers are. And they can get pretty deep with state-sponsored cyber criminal skills. Anything could happen in the background of your CI worker (or your laptop) between when you execute `git checkout <tag>` and `make`. Any checksums you generate or check can be modified right before you check them. Or maybe your `/usr/local/bin/sha256sum` has been tampered with. The list goes on.

When we're talking about getting all major open source projects (which have little to no funding) to add enough security to resist nation-states (which have plenty of funding), the math simply doesn't add it.

## "We should disable automatic updates"

Automatic updates are a tradeoff, I'll grant that. You are trusting a vendor to not ship a bad update in exchange for getting security fixes ASAP. However, just think for half a second about how the SolarWinds hack worked. The attackers snuck some code into an *opaque, propriety, binary blob that [lied dormant for 12-14 days](https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach#SolarWinds_exploit) before doing anything strange*. There is absolutely no way we can perform a full binary analysis of every new version of every binary blob that powers modern IT.

Automating updates are generally recommended because it "helps to ensure the
timeliness and completeness of system patching operations", as mentioned in [NIST 800-53§3.19](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf). If you do have the time for manual reviews AND audits that the manual updates have been applied, that's preferable, but obviously that takes a lot of time. For everything else, automation keeps you safer. The SolarWinds hack changed nothing about that calculus.

## "We should deploy another agent to detect these kinds of hacks"

This idea pre-dates the SolarWinds hack, but it's still around in full force. Many security standards recommend or even require a [Security Information Event Management (SIEM)](https://en.wikipedia.org/wiki/Security_information_and_event_management) system. Maybe you'd like to deploy [SolarWinds' own SIEM product](https://www.solarwinds.com/security-event-manager/siem-tools)? It should be obvious that installing yet-another highly-privileged agent on all your servers is the exact reason why the SolarWinds hack was as devastating as it was. I appreciate the thought that goes into e.g. [DataDog's agent build process](https://www.datadoghq.com/blog/engineering/secure-publication-of-datadog-agent-integrations-with-tuf-and-in-toto/), but DataDog's agent still runs [without any kind of systemd sandboxing](https://github.com/DataDog/datadog-agent/blob/fd57de7ae6c889b45f99b57c36896c3c161dfdd2/omnibus/config/templates/datadog-agent/systemd.service.erb), which gives it more permissions than it needs. It's one bad world-readable SUID file away from a full takeover, which is just [one of many local privilege escalation routes](https://github.com/RoqueNight/Linux-Privilege-Escalation-Basics) that exist on Linux.

Having visibility into your own network is a good idea, but vendors rarely care to follow the principle of least privilege, frequently just demanding full root access (like for [Nessus compliance scans](https://static.tenable.com/documentation/nessus_compliance_checks.pdf#page=11) which are entirely read-only). If you need to stop supply chain attacks, more privileged agents will just significantly broaden your exposure to supply chain attacks.

## The Inconvenient Truth about how to actually fix this

Reading through [some of NIST's guidance](https://www.cisa.gov/sites/default/files/publications/defending_against_software_supply_chain_attacks_508_1.pdf) hints at the real problem in my opinion: "many third-party software products require privileged access". This is an "insecure by design" problem. NIST continues: "Even when a product can effectively operate on a network with reduced privileges, products will oftentimes default to asking for greater privileges during installation to ensure the product’s maximum effectiveness across different types of customer networks. Customers often accept third-party software defaults without investigating further, allowing additional accessibility vectors".

If you want to prevent that from being abused, NIST's recommendations in that document basically amount to "build an enormous, mature security organization". That implicitly assumes everyone keeps the "business as usual" way of installing and running third party software. It doesn't have to be this way.

## The (quite ambitious) solution

**We should run software in a way where we don't really care if it has a vulnerability, because it will happen**. Just like how no good auth system relies on user-memorized passwords alone anymore; we have 2FA and passkeys now which remove that human element as part of their design. That same energy should have been applied in the wake of the SolarWinds hack, but it still feels like "security by design" is a fringe belief.

One idea that could help is [capabilities-based security](https://en.wikipedia.org/wiki/Capability-based_security). The idea is that by default, running software can't do much of anything unless it is given an unforgeable "capability" to do things like access files, the network, particular syscalls, etc. This is fairly incompatible with UNIX and Windows because (aside from root/administrator access), programs have the permission to do a LOT of damage by default, and removing any of those permissions would break a lot programs. If you want security by design, backwards-compatibility is a sacrifice you'll have to make.

Capabilities-based security isn't easy to implement. Some weaknesses I've found in the wild include:

* Making capabilities too course-grained, like having a general "write/edit" permission with no separate "create" or "append" permission, meaning your backup tool is still ripe for a ransomware attack.
* Making the default capabilities too permissive, like Docker's default seccomp rules which prioritized compatibility over security.
* Making fine-grained capabilities that actually imply other capabilities, like [Deno's "--allow-run" permission being equal to "--allow-all"](https://github.com/denoland/deno/issues/2128). Or Kubernetes' ["create pod" permissions implying "get secret" permissions](https://kubernetes.io/docs/concepts/security/secrets-good-practices/#least-privilege-secrets).
* Packaging software alongside the capabilities that constrain it, like RPMs with systemd units that include sandboxing. A supply chain attack could easily remove the sandboxing. You need something like what browser extensions do where new permissions require explicit approval from the user.
* Making capabilities apply to too-course of a boundary, like giving one set of capabilities to a complex, multi-threaded process that includes a lot of third-party code for instance. Any sub-component of that process could be tricked into abusing one of its capabilities. [Language-based capabilities](https://github.com/austral/austral) have the edge here.
* Lacking tools for knowing which capabilities a given program needs. This kills adoption, since not many developers could tell you exactly which kernel features their code uses off the top of their head.

If we could agree on a good, standardized capabilities model for software and everyone starts using it, we will have reached security Nirvana.

* We can keep the benefits of huge dependency trees without the risks!
* IT organizations can spend significantly less time on remediating vulns since the vast majority of vulns will not be exploitable!
* Lateral movement becomes nearly improbable!
* We don't have to hold OSS communities to rigorous security standards that even well-funded companies struggle with!
* And more!

## Back to reality

We're still talking about something that's probably a decade away or more, but given the benefits and the constant string of high-profile hacks like the SolarWinds hack, I'm just upset the ball *still* isn't rolling in the right direction 3 years later.

But history shows it's not impossible, at least not if you're the [richest company on the planet](https://en.wikipedia.org/wiki/List_of_public_corporations_by_market_capitalization). Over time (particularly since [iOS 6](https://www.cultofmac.com/173128/new-ios-6-privacy-settings-limit-access-to-photos-contact-calendars-and-more/)), less and less permissions have been granted to iOS apps by default, instead requiring apps to request those permissions from users explicitly. It's still not perfect (like access to contacts still being a binary "yes/no"), but every permission clawed back from the default set required breaking backwards compatibility, a phrase rarely uttered in regard to the Linux and Windows kernels.

If you have been an iOS developer since 2012, I'm sorry you had to go through that, but your extra work has been profoundly important to the privacy and security of mobile OSes. I'd like to see that same [principled](./2023-05-20-ethics-self-attestation.md) energy brought to desktop and server OSes. If we don't, the next SolarWinds-like hack is just around the corner.
