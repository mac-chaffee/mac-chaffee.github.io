+++
title = "On Docker Compose as a Product"
+++

Last year I left [a comment on HN](https://news.ycombinator.com/item?id=35327743) about Docker Compose that seemed to get some traction. I was complaining about how both Docker Compose and Kubernetes are leakly abstractions over infrastructure. My general stance is that the Kubernetes API, despite its vast complexity, allows you to describe like 99.9% of modern applications. All attempts to simply that API surface (such as Docker Compose's simpler syntax) results in leakier abstractions that are more limiting. That's fine if you can squeeze all your applications into smaller standardized boxes, but that's a lot of work. But does that mean there's no room in this space for Docker Compose? No, I think it still can serve a niche.

Someone reached out to me via email about that comment to ask for my thoughts on Docker Compose as a product, and my response just got so long that I decided to write this post. I love giving my unsolicited, uninformed opinions, so I'm very happy to give my *solicited*, uninformed opinion for a change!

My background is that I worked as a software engineer for 2 years before moving to DevOps for the last 3+ years. Now I'm kind of a platform engineer with a focus on security and site reliability. I also heavily use Kubernetes and I'm one of those weirdos that *wants* it to continue "eating the world", since I think it's good enough and it sure beats having to learn ten different container orchestrators. So my bias towards Kubernetes will definitely show through here.

I've used Compose in two places: as a development environment for multi-container apps (that run on Kubernetes in production), and as a deployment method on single VMs.

### Docker Compose as a development environment

When using Compose as a development environment, its strength is its simplicity and terseness. You can describe a web app, a database, and a cache in just a few dozen lines of yaml thanks to sane defaults. But there are a few pain points:

1. **Live-reloading is needed, but setting it up under Compose can be a chore.** You have to have a volume-mount to the right path inside and outside the container, and you have to configure Docker to allow bind-mounts in your code directory. Also maybe this is fixed now, but Docker used to have long-standing performance issues with IO to bind-mounted volumes on macOS. Not good for parsing a giant node_modules folder. If your programming language doesn't support live-reloading, crafting a Dockerfile to be cache-friendly is also an annoying art form.

2. **Lack of dev/prod parity when deploying to Kubernetes.** For a non-trivial application, maintaining both a docker-compose file and a helm chart is a lot of work, with a high chance of missing bugs until they land in production. Like having different health probe logic, presence or absence of resource limits, different methods of service discovery, and no access to the Kubernetes API during development.

3. **Leaks in the abstraction.** Kinda like I mentioned in my HN comment, as soon as you need to something non-trivial, you have to learn too much about Compose's inner workings. One example is anything that doesn't work in the default networking model. But this is just a super hard, unsolved problem across the entire industry.

### Docker Compose as a deployment method

When using Compose as a deployment method, again its strength is simplicity. Just install docker, scp the docker-compose file, and start it. The pain points here are:

1. **Single-node only.** Many apps never reach a point where they need more than one node, but having to either rip out your entire existing deployment method or invest in Swarm are not good options. With no potential for high availability, Compose-based deployments strike me as temporary/not truly production-ready.

2. **Security issues.** Docker automatically punches holes in the local firewall, which is very convenient for users and hackers alike. Compose seems to be lacking some of the items you can specify in a Kubernetes securityContext that are now considered best-practice, like readOnlyRootFileSystem, seccomp profiles, and runAsUser. Also the docker socket badly needs more fine-grained permissions.

3. **Limited functionality.** Without the abstractions that e.g. Kubernetes provides for ingress, storage classes, interaction with hardware like GPUs, and extensibility via CRDs, productions apps are left with limited ability to adapt to production pressures.

4. **Weaker ecosystem.** Every non-trivial production app needs a constellation of supporting services such as logging, monitoring, security tools, backup solutions, CI/CD tools, and more. In the Kubernetes ecosystem, there are cutting-edge FOSS solutions to each of those problems that can be installed with a single `helm install` or `kubectl apply` command.

### What do I think Docker Compose (as a product) should focus on?

To me, Compose as a product seems stuck in this constant tug-of-war between needing to retain its simplicity while simultaneously being a good development environment AND being a good deployment method. Given all these pain points, I don't think it can succeed at all those goals since they are pretty much in conflict with one another, but I could see Compose choosing one of two paths at this crossroads.

I could see Compose choosing to be "a really good development environment" by doing things like:

* Deeply integrating with major programming languages to make live-reloading easier (I just now learned about [`watch`](https://docs.docker.com/compose/file-watch/) which seems to be a step in the right direction.)
* Deeply integrating with Kubernetes, like providing automatic conversion to and from Kubernetes manifests or helm charts ([kompose](https://kompose.io/) has a LONG way to go).
* Having a feature like [Telepresence](https://www.getambassador.io/docs/telepresence/latest/docker/compose) where I can run `docker-compose up -d` and have the containers act as if they are inside of a real remote Kubernetes cluster that is properly configured to match production.
* A long shot but: maybe addressing the fact that docker-based development environments often "rot" since builds aren't fully reproducible. Taking some inspiration from Nix while retaining the simplicity Compose is known for would be a game changer.

I could also see Compose choosing to be "a really good deployment method", but not having a good multi-node solution and having to fight with Kubernetes for room in this space seems unwise to me. Also, being a really good deployment method is the least compatible with simplicity, which is Compose's most important differentiator IMO.

Anyway, that concludes my scattered thoughts on Docker Compose and where it fits into the modern developer's tool belt. All I can say in conclusion is that I sure am glad I'm not a product manager! I've been reading [Rich Mironov's Product Bytes](https://www.mironov.com/) and it sounds like [there's a method to the madness](https://www.mironov.com/pri-politics/) of feature prioritization without succumbing to [product sprawl](https://www.mironov.com/sprawl/). But I'm a naturally indecisive person, so I'm very happy to stay in my lane and let the actual product managers make these tough calls for me!
