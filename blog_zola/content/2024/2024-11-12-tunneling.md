+++
title = "Flouting the Internet Protocols with Tunnels"
+++

Recently at work I've learned about [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), which has increased my interest in tunneling technologies in general.

[Tunneling](https://en.wikipedia.org/wiki/Tunneling_protocol) is a generic networking term, but in the web-dominated world it usually refers to software that you can run on any computer with outbound network access to serve a website. The tunneling software has a another component running in the cloud that configures DNS, terminates TLS, and handles the networking magic to send the packets to your computer.

My main interest is using tunneling for serving websites on my home server. While I'm fortunate to have a fairly static IP address, I don't want to risk having to update my DNS records after a power outage, and I don't like having to port-forward. I say "sites" plural, but I really just have one site, which is an instance of the open-source recipe site [Mealie](https://mealie.io/) at `recipes.macchaffee.com`.

I feel like by using tunnels, the authors of various internet protocols are rolling in their graves (wait, are they mostly still alive?), but hey I've got websites that need to be deployed and my ISP won't help me do it.

## Choosing the right tunnel

After skimming through the [awesome-tunneling](https://github.com/anderspitman/awesome-tunneling) list, I struggle to find a better solution than Cloudflare Tunnels, much to my chagrin as someone who fears [the centralization of the Internet](@/2024/2024-06-15-ddos-attacks.md). My ideal features include:

1. Designed for production use, not just development.
2. Good protocol choice for the tunnel itself, such as WireGuard or HTTP/3.
3. Multi-regional, including integration with a CDN for caching (why not make the most of the extra network hop?).
4. Written in a performant, memory-safe language.
5. Extra server-side features like metrics, authentication, and everything else you'd expect from a modern load balancer.
6. Open-source.
7. Not a Cloudflare product.

So to any older CDN providers looking to capture a piece of the modern stack, there's your next idea!

With Cloudflare Tunnels out of the picture, I ended up compromising on #2, #3, and #5 on my wishlist and settled on [tuns](https://pico.sh/tuns). They also offer [static site hosting](https://pico.sh/pgs) with features I wanted, so I took the bundle deal and got both.

The client-side part of tuns is just `ssh -R`, which makes it very easy to get started. There's also [tunmgr](https://github.com/picosh/tunmgr) which is less than 1k lines of Go code, mainly just wrapping the `ssh -R` equivalent from Golang's standard library, plus some optional Docker integration.

With my choice of tunneling software made, I moved on to the fun part: deploying tuns to serve traffic to my recipe site hosted on my home server.

## Deploying

First, a short summary of my homelab setup: It's an Intel NUC minicomputer running [NixOS](https://nixos.org/) which is running [k3s](https://docs.k3s.io/) (a minimal Kubernetes distribution). Everything's deployed from a git repo using [FluxCD](https://fluxcd.io/).

So since tunmgr doesn't provide a Kubernetes installation mechanism, I made it myself ([and contributed it](https://github.com/picosh/tunmgr/pull/2)).

The steps remaining were:

1. Generate a new SSH key.
2. Add it to my Pico account.
3. Also add it as a [Kubernetes Secret](@/2022/2022-04-30-k8s-secrets.md) (encrypted in git with [SOPS](https://github.com/getsops/sops)) to my cluster.
4. Deploy tunmgr (a single Deployment, with locked-down permissions and even an egress NetworkPolicy to ensure it only talks to the `tuns.sh` server).
5. Configure tunmgr to direct all traffic for `recipes.macchaffee.com` to [Traefik](https://doc.traefik.io/traefik/) (this is needed to obtain normal load balancer features like metrics and IP allow-listing, which will come into play later).

After configuring my DNS and waiting a short delay for the TLS cert to be provisioned, my recipes site was up and running! No port-forwarding required! Here's what it looks like:

<figure>
  <img src="/blog/2024/tuns-diagram.png" alt="A diagram showing traffic flowing from the tuns server, into a box representing my home server. Inside the home server box, the traffic first hits tunmgr, then traefik, then mealie."/>
  <figcaption><em>Not pictured: hundreds of lines of YAML</em></figcaption>
</figure>

But then tragedy struck. As soon as the hostname `recipes.macchaffee.com` landed in the [Certificate Transparency](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency) logs, I was reminded that the internet is a hostile place since I immediately received requests from scanners searching for vulnerabilities or sensitive files (a [common occurance](https://blog.apnic.net/2023/08/30/certifiably-vulnerable-using-certificate-transparency-logs-for-target-reconnaissance/)).

I constantly struggle with the balance between hosting "public" sites that aren't *too* public, including this blog. My recipe site is the same. I want to be able to access it from outside my house, and I want my friends and family to be able to access it too without having to set up a VPN client or keep track of a password. But I don't want random scanners to eventually find a vulnerability in Mealie and automatically deploy some malware straight out of a scifi horror movie on my home network.

So I needed to build the Internet equivalent of a "No tresspassing" sign, which I call [`ip-pass`](https://github.com/mac-chaffee/ip-pass).

# The creation of ip-pass

My software engineer skills have been collecting dust ever since I moved into DevOps and started "coding" in YAML, but I dusted them off and started up [a new Golang project](https://github.com/mac-chaffee/ip-pass).

This was also a good excuse to practice AI-assisted coding, since I've read a lot more Golang than I've written as a result of spending years debugging issues in various [CNCF](https://www.cncf.io/) projects. I just used [Claude](https://claude.ai/) for some things instead of scrolling through GitHub to find an example to copy/paste. The only interesting thing that happened is Claude generated a test case with the IP address `203.0.113.333` which is invalid. Thankfully the test failed and caught it, because I didn't notice. I think this is a lesson that "just have a human check the AI's output" will never work because AI easily generates more output than humans have attention. You need strict automated checks (like a compiler) for this kind of thing.

The project is one giant `main.go` file which starts an HTTP server which reads the user's IP address and uses the Kubernetes `client-go` to add the IP to an allow list. Since I'm using Traefik, ip-pass updates a [Traefik Middleware](https://doc.traefik.io/traefik/middlewares/http/ipallowlist/) that contains the allow-list.

There's a web interface too, which I've deployed to `access.macchaffee.com` (also via `tuns`).

When you go to `access.macchaffee.com`, you click a big green "Gain Access" button which allow-lists your IP address and redirects you to `recipes.macchaffee.com`. Since the recipes site blocks all IPs not on the allow-list, bots are thwarted, but anyone with a brain and a browser can still get in with minimal hassle.

Obviously this has no *real* security benefits because it's just security by obscurity. It's like changing your default SSH port to something other than port 22. But I think it hits a sweet spot on the [security, usability, functionality triangle](https://blog.c3l-security.com/2019/06/balancing-functionality-usability-and.html).
