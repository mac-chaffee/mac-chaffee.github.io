---
layout: post
title:  "Kube Proxy"
date:   2020-07-12 13:00:00 -0400
image:  assets/kube-proxy.png
---

Over the past few months, my coworkers and I had been seeing strange behavior in our kubernetes cluster. I ended up investigating what turned out to be the hardest bug I've ever had to track down, and I learned a lot about kubernetes networking internals along the way.

## Background

For context, we use kubernetes sort of like a Continuous Integration server like Jenkins, where ephemeral pods are created hundreds of times per day. Our kubernetes cluster has 11 nodes which run in OpenStack. So we're not Google-scale but still large and distributed enough to produce annoying bugs like the one I'm about to describe.

The first thing our ephemeral pods do is request some metadata from another pod, `cxtm-scheduler`. But about once per day, one of these ephemeral pods would crash *exactly 10 seconds after it starts up* complaining about not being able to download that metadata:

```
dial tcp: lookup cxtm-scheduler on 169.254.25.10:53: no such host
```

At this point my knowledge of kubernetes networking was limited. I just saw port 53 and assumed we dropped two UDP packets. The [default settings of /etc/resolv.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5.html) will retry DNS queries twice with a timeout of 5 seconds, so the 10 second delay makes sense now. Problem solved, right? We're dropping UDP packets.

## DNS Lookup Order

Searching this error led me to what I thought was the holy grail: A blog post describing my exact issue: https://blog.cloudflare.com/debugging-war-story-the-mystery-of-nxdomain/

The Cloudflare devs attribute the error to a line like the one I had in my pod's `/etc/resolv.conf` file:

```
search default.svc.cluster.local svc.cluster.local cluster.local
```

This configuration means that in order to resolve "cxtm-scheduler", we must look up the following names in order:

1. "cxtm-scheduler.default.svc.cluster.local" -> Works
2. "cxtm-scheduler.svc.cluster.local" -> Fails
3. "cxtm-scheduler.cluster.local" -> Fails
4. "cxtm-scheduler" -> Works

{% include image.html name="full_scheduler_tcpdump.png"
  alt="A TCP dump of DNS traffic describing the above steps"
  caption="This TCP dump was gathered by intentionally changing the DNS IP to a fake one" %}

So seeing "no such host" must mean either the second or the third lookup actually makes it to the DNS server, which correctly replies with NXDOMAIN. So maybe our DNS server is malfunctioning and ignoring only the first request?

## NodeLocalDNS

The IP address 169.254.25.10 is special, and if you google it you'll find that it's used for [NodeLocalDNS](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0030-nodelocal-dns-cache.md).
NodeLocalDNS was added to reduce pressure on the CoreDNS pods which answer DNS queries for the entire cluster. But it turns out NodeLocalDNS [only caches DNS results for 30 seconds by default](https://github.com/kubernetes/kubernetes/blob/7151131d79674d073e716063a03f8cbd67671e33/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml#L96), and we don't spin up new pods that quickly. So when NodeLocalDNS doesn't know the IP for a given domain name, it consults the CoreDNS pods. So maybe our CoreDNS pods are malfunctioning?


## CoreDNS

Each kubernetes cluster runs two [CoreDNS pods (formerly kube-dns)](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) in order to match Service names to cluster IP addresses.







, so bump up the retries with [pod.spec.dnsConfig](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-dns-config).

It specifically says "no such host" which is what golang's resolver says when it receives an [NXDOMAIN error](https://en.wikipedia.org/wiki/Domain_Name_System#DNS_message_format). If the packets don't arrive, you'll instead see a similarly descriptive message of "i/o timeout".


Why is the DNS server saying it can't find "cxtm-scheduler"? Testing from other pods shows the URL "cxtm-scheduler" properly resolves to the [ClusterIP of the Service](https://kubernetes.io/docs/concepts/services-networking/service/#dns). The key is that /etc/resolv.conf contains the following lines:

Calico outgoinng traffic delay: https://github.com/projectcalico/calico/issues/2471
