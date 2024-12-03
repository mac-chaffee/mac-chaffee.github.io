+++
title = "The next platform"
+++

As someone who has built a career on Kubernetes, I'm always thinking about what "the next platform" is (for job security purposes). By "platform", I mean the kind that platform engineers like myself build for internal dev teams on which to run their applications. Kubernetes has been the star platform for quite a few years now (or maybe that's just my internet bubble), but will that last forever?

Despite the fact that I stan Kubernetes on this blog, I understand more than most that it can be quite painful, so I've been on a search for "the next platform" lately. Let's start with a rough list of problems with Kubernetes-based platforms and a list of requirements for "the next platform".

## Problems with Kubernetes-based platforms

You could train a large language model on Kubernetes complaints alone, but I'll just list some common ones:

* Steep learning curve.
* Lots of moving parts.
* Requires a dozen other CNCF projects to do useful work.
* Helm templating was a mistake but it's too popular now.
* Everything has to be containerized, which complicates dev environments and slows down CI/CD.

And some of my hot takes:

* Kubernetes workloads are insecure by default. Too many CNCF projects simply don't work with safe `securityContext` settings or least-privilege RBAC, and these insecure defaults are footguns for devs.
* Manually tuning CPU/RAM `requests` and `limits` should go the way of the rotary phone. They should be automatically tuned at runtime.
* Kubernetes' killer feature is self-healing, but too many apps are simply not designed with resilience in mind.

Needless to say, there's a lot of room for improvement. But we have to make sure "the next platform" checks all the boxes.

## List of requirements for "the next platform"

This is not an exhaustive list either, but we should probably have things like:

* Ability to accept HTTP requests from the Internet.
* Ability to store state somewhere that is highly-available, secure, and backed up.
* Ability to manage app configuration and secrets.
* Ability to collect logs, metrics, and other debugging info from your app.
* Ability to easily deploy new versions of your app.

From that list, most platform-as-a-service (PaaS) providers such as Heroku already do all those things and have existed for a long time. But why isn't everyone using a PaaS provider? I think there are some other requirements that preclude the use of many current PaaS providers:

* Affordability at scale. Even small-to-medium companies may be spending over $100k per month on their cloud bill these days. Adding the PaaS markup on top would be too much.
* Ability to run on-premise.
* Custom hardware like GPUs, NVMe drives, HSMs, etc.
* Custom networking like peering with on-premise infrastructure.
* Custom security requirements.
* Edge connectivity.
* Compatibility with legacy apps.

If you are a CTO who is trying to roll out a "platform" and you have those requirements, then a Kubernetes-based platform may be more compelling because of the extra flexibility. I believe every app that runs on Linux can technically run on Kubernetes (even resorting to [KubeVirt](https://kubevirt.io/) if necessary), but a PaaS provider could easily say "we don't support that".

## Possible contenders

With these lists in my mind, I've been exploring the landscape of possible contenders for "the next platform". Like all kinds of future-prediction, this is very subjective and very likely to age poorly, so let's forge ahead regardless.

### PaleoOps

This is the idea of running everything on one or two big bare-metal servers, usually from budget providers like Hetzner. Not sure if there's a name for this, so I'm calling it PaleoOps. Similar to how the [paleo diet](https://en.wikipedia.org/wiki/Paleolithic_diet) developed in response to the rapid expansion of processed foods and their health risks, there's some good and bad reasoning used to justify PaleoOps. Applications got super complex super quick and a whole generation of developers got burned, leading to embracing the simpler infrastructure of the past, which [has been successful](http://rachelbythebay.com/w/2022/01/27/scale/) in some cases.

But sometimes uncritically embracing older things results in [suffering from the same problems](@/2024/2024-11-23-you-have-built-a-kubernetes.md) that lead to the rise of the modern replacement in the first place. Notable issues include the increased exposure to hardware failure, the lack of edge support, the security risks of non-segmented applications, and huge amount of features you'd have to develop yourself. So I don't think this will become "the next platform" but it will always serve a niche where the benefits of a fully automated platform are not needed.

### Honorable mention: Erlang, Darklang

Language-based distributed programming models have always been fascinating to me. [Erlang/Elixir and other BEAM languages](https://vereis.com/posts/disterl_inbox) were early movers, apparently powering vast distributed systems at [Ericsson](https://en.wikipedia.org/wiki/Erlang_(programming_language)#History). There was also a time when I thought [Akka](https://en.wikipedia.org/wiki/Akka_(toolkit)) and actor-based programming would take over the world. Notably those both gloss over the deployment/DevOps work, sometimes just relying on Docker or Kubernetes (a la [libcluster](https://github.com/bitwalker/libcluster)). [Darklang](https://darklang.com/) is another group building something like "the next platform", all from a single programming language.

But all of these are a bit of a moonshot in my opinion since way too much existing code is written in JavaScript, Python, etc. You could compile apps to run on the BEAM, but you can't simply add OTP semantics to existing apps.

### Fly.io

I've never used Fly.io personally, so consider my opinion on this subject to be more uninformed than my usual opinions.

Fly.io was originally developed as a next-generation PaaS that solved one main deficiency of previous-generation PaaSes: Edge support. Their choice of [Firecracker](https://firecracker-microvm.github.io/) as the hypervisor means they can spin VMs up and down rapidly and pack lots of VMs on a single physical server, keeping costs low. Using VMs means broad support for existing applications that container-based PaaSes may struggle to match.

I think Fly.io's reliance on bare-metal servers and VMs is an issue. They recently had to [re-invent the wheel of VM migrations](https://fly.io/blog/machine-migrations/) with much difficulty. This is something existing hypervisors have had decades to perfect ([vMotion has existed since 2003](https://virtualizationreview.com/articles/2016/09/14/evolution-of-vmware-vmotion.aspx)).

Additionally, you can bet that major cloud providers don't just slide servers into racks and hope they don't break. They almost certainly have fancy methods of capacity planning, redundancy, lifecycle analysis, and failure analysis to reduce the chances your pet VM randomly dies due to a bad memory stick.

But hardware failure will always be a problem for any application that runs on a single server (unless that server is an [IBM mainframes with full hardware redundancy](https://arstechnica.com/information-technology/2023/07/the-ibm-mainframe-how-it-runs-and-why-it-survives/)). Because hardware failure is rare and often hidden from users, this can be a sneaky footgun that devs consider too unlikely to matter until it happens. I believe "the next platform" should disarm this footgun.

### Serverless - AWS Lambda

Launched in 2014, AWS Lambda allows you to upload a file containing a function that can process HTTP requests. It uses Firecracker to spawn these VMs rapidly and provide secure multi-tenancy. Lambda promised to revolutionize deployment and really popularized the concept of "[serverless](https://en.wikipedia.org/wiki/Serverless_computing)" apps that do not know or care about the server(s) running the app.

But I believe Lambda was a bit ahead of its time. Web frameworks like Django were quite popular, but you couldn't just run Django on Lambda without a tool like [Zappa](https://github.com/zappa/Zappa) to magically make it "serverless", which wouldn't come out for another 2-3 years. You'd also want a serverless database like Aurora Serverless which wouldn't come out [until 2018](https://aws.amazon.com/blogs/aws/aurora-serverless-ga/) (or [2024 if you use postgres](https://aws.amazon.com/blogs/aws/amazon-aurora-postgresql-limitless-database-is-now-generally-available/)).

Given this is an AWS service, setting up a simple Lambda requires IAM roles, API gateway, and maybe some KMS config which can get quite complicated. There were also problems with cold-start times of [100-1000ms](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/) that didn't have great workarounds until later. And perhaps the loudest problem of all was unexpectedly huge bills when Lambdas got DoS'd or [invoked by infinite loops](https://news.ycombinator.com/item?id=31907374).

One notable achievement was that [Lambda was likely used for the successful launch of covidtests.gov in 2022](https://adhoc.team/2022/01/18/covidtests-usps-aws-managed-services/). This is in stark contrast to the [disastrous launch of healthcare.gov in 2013](https://en.wikipedia.org/wiki/HealthCare.gov) which used traditional deployment methods and couldn't withstand more than 1,100 of the 250,000 concurrent users trying to access it.

Overall, I think of Lambda as the beta release of "the next platform". It has proven some core ideas like serverless computing are possible, but it has all the rough edges of a first-mover.

### V8 Isolates

I've never been a big fan of Cloudflare's market dominance, but I must say that the more I read about [Cloudflare's serverless products](https://developers.cloudflare.com/workers/platform/storage-options/), the more I start shaking in my platform engineering boots. I also haven't used any of these products, so perhaps they sound better than they really are. [Deno Deploy](https://deno.com/deploy) is also built on V8 isolates and serves as a compelling competitor to Cloudflare, but I know even less about their offerings.

The core product is Cloudflare Workers, which is their version of AWS Lambda. The key difference is they use [V8 isolates](https://developers.cloudflare.com/workers/reference/how-workers-works/#isolates) instead of Firecracker VMs, which are essentially using the same tech that isolates Chrome tabs from each other (apparently Chrome uses separate processes _and_ isolates, but Cloudflare runs all the isolates in the same process, which [they claim is still safe](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/)). This eliminates the cold-start problem and drastically reduces the overhead for running each isolate. V8 isolates primarily support JavaScript (including some JS web frameworks), but they also support Rust and Python [by compiling to WebAssembly](https://developers.cloudflare.com/workers/languages/python/how-python-workers-work/).

Things get even more interesting when you look at all the [other compatible offerings](https://developers.cloudflare.com/workers/platform/storage-options/), like Workers KV (distributed key-value store), R2 (S3-like object storage), D1 (managed relational databases), and even [CI/CD](https://developers.cloudflare.com/workers/ci-cd/). Deno has also been rolling out a similarly impressive list of compatible products. These all seem like compelling replacements for many common bits of infrastructure.

But the devil is in the details. Workers have some quite-restrictive [limits](https://developers.cloudflare.com/workers/platform/limits/) like a max 30 seconds of CPU time, a max 128MB of memory, and just barely enough POSIX support to be usable-but-painful. They haven't really solved the problem of huge bills from runaway Workers either. And while you are fantasizing about the long list of complex infra you could replace with these products, you are like a fish being lured in by an angler fish's glow, only to be swallowed whole by the jaws of vendor lock-in.

## Conclusion

Despite all the downsides, I'm starting to feel like we're getting close to "the next platform". Perhaps Workers is like a 1.0 release of something that only really gets good at version 2.0. Maybe V8 isolates will make it to 2.0, or maybe they'll be replaced by unikernels (like [NanoVMs](https://nanovms.com/)) or [this Hyperlight thing that Microsoft is making](https://opensource.microsoft.com/blog/2024/11/07/introducing-hyperlight-virtual-machine-based-security-for-functions-at-scale/). To me, the last remaining pieces of the "next platform" puzzle are things like:

* Radically solving the pricing problem, where the cost of using the platform is just a slight markup on EC2 prices.
* Fully open-source, including the ability to deploy it yourself (like Kubernetes).
* Strikes the right balance between "compatible with existing apps" and "stopping people from deploying the same bloated/unreliable/insecure garbage we've been building for decades".

At this point, we have one leg in the past and one leg in the future. The past is pet servers and VMs. The present is clusters of containers that still have many of the same pain points. When the future comes, I just hope it's not another chore.
