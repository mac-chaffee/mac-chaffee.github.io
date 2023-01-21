+++
title = "The Fumbled Deprecation of PodSecurityPolicies"
date = 2022-05-08
+++

In [2016](https://github.com/kubernetes/kubernetes/pull/7893), Kubernetes v1.3 was released which included a new API type: PodSecurityPolicies (PSPs). The original [design proposal](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md) had the lofty goal of allowing cluster admins to restrict various Linux privileges to some Pods while still allowing other Pods to use them. PSPs filled an important security hole where having the ability to run pods could let you bypass every other security control in the cluster.

But in 2021, after 5 years of PSPs still being considered "beta", they were [deprecated](https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/). The maintainers had their [reasons](https://youtu.be/SFtHRmPuhEw?t=963), but in the year since this deprecation, I believe it was mismanaged for a number of reasons.


## What are PodSecurityPolicies (PSPs)?

<details>
<summary>Click to expand if you don't know what they are already</summary>

The Official docs are [here](https://kubernetes.io/docs/concepts/security/pod-security-policy/), but PSPs are essentially yaml files that restrict [some special permissions](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) that Pods can have such as allowed UIDs/GIDs, `allowPrivilegeEscalation`, hostPath mounts, Linux Capabilities, etc. These permissions are extremely important to control since most any one of them could be used to break out of the container sandbox in some way.

Here's an example PSP that implements the CIS Benchmarks for Kubernetes:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  annotations:
    # https://docs.docker.com/engine/security/seccomp/
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: docker/default,runtime/default
    seccomp.security.alpha.kubernetes.io/defaultProfileName: runtime/default
  name: restricted
spec:
  # CIS 5.2.1
  privileged: false
  # CIS 5.2.2
  hostPID: false
  # CIS 5.2.3
  hostIPC: false
  # CIS 5.2.4
  hostNetwork: false
  # CIS 5.2.5
  allowPrivilegeEscalation: false
  # CIS 5.2.6
  runAsUser:
    rule: MustRunAsNonRoot
  # CIS 5.2.7/8/9
  requiredDropCapabilities:
  - ALL
  # Needed to stop hostPath mounts, surprisingly not mentioned in CIS Benchmarks
  volumes:
  - configMap
  - emptyDir
  - projected
  - secret
  - downwardAPI
  - persistentVolumeClaim
  - ephemeral
```

As far as I know, any Pod that is bound by that PSP will not be able to escape the container sandbox (except via a new zero-day, of course).

Once PSPs are enabled and you have deployed some policies ([here's](https://github.com/kubernetes-sigs/kubespray/blob/323a1113629b7cea77d18a80196e4a2544f747bc/roles/kubernetes-apps/cluster_roles/tasks/main.yml#L43) how Kubespray does it), every new Pod will be checked against your PSPs. There are some complex rules about which policy is eventually applied to your pod (Pod SA, user's SA, prefer non-mutating, then alphabetical), but essentially your Pod will either be allowed, mutated-then-allowed, or blocked. To help debug, Pods will be given a `kubernetes.io/psp` annotation which tells you which policy was applied.

Applications can ship their own PodSecurityPolicies if they need special permissions, such as [this one](https://github.com/kubernetes/ingress-nginx/blob/helm-chart-4.1.0/charts/ingress-nginx/templates/controller-psp.yaml) that ships with ingress-nginx.

</details>


## Reason 1: PSPs really weren't that bad

While it's true there are usability/complexity concerns with PodSecurityPolicies, I believe this just reflects the fact that container security is a complex subject. Even after a year of dealing with this stuff, I'm still learning new and troubling ways that attackers can break out of containers.

That necessarily means there are a lot of knobs to tweak. In the video where sig-auth announces plans to deprecate PSPs, [they say](https://youtu.be/SFtHRmPuhEw?t=1921) ">90% of users care about 2-3 policies". I agree, but any policy mechanism should care a LOT about that last 10% since that's where the true, unavoidable complexity lies. This barrier to entry will always be present no matter what implementation we choose.

Additionally, three problems were explicitly mentioned in the sig-auth video: 1) flawed authentication model, 2) difficult to roll out, and 3) inconsistent/unbounded API. These problems don't come across to me as insurmountable technical obstacles. They just seem like regular constraints/tradeoffs that any complex software needs to handle. And indeed they acknowledge that one possible option is to fix these issues rather than deprecating PSPs all together.

So in summary, PodSecurityPolicies are definitely imperfect, but not so deeply flawed as to warrant deprecation. Yes, we'd have to break backwards compatibility to fix some imperfections (like enabling PSPs by default), but that should be expected from a "beta" API.

## Reason 2: Replacements for PSPs weren't ready yet

PSPs were officially deprecated with the release of Kubernetes v1.21, which happened on April 8th, 2021. While PSPs will not be *removed* until v1.25, deprecation means that new clusters probably shouldn't use PSPs. But what should you use instead? That question did not have an official answer until more than a month later when the [PSP Replacement KEP](https://github.com/kubernetes/enhancements/pull/2582) was officially merged. But that was just a proposal. The implementation ([Pod Security Admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), PSA) wouldn't enter "beta" status until v1.23, *8 months* after PSPs were deprecated.

While that Pod Security Admission controller was the official, in-tree replacement, the deprecation announcement [blog post](https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) pointed to [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) as an unofficial replacement. But Gatekeeper was missing an important feature that was present in PSPs: the ability to mutate pods. Coincidentally, Gatekeeper [released](https://github.com/open-policy-agent/gatekeeper/releases/tag/v3.4.0) "alpha" support for mutation on the same day PSPs were deprecated, which didn't become "beta" for [another 7 months](https://github.com/open-policy-agent/gatekeeper/releases/tag/v3.7.0) where it remains to this day.

So anyone deploying new clusters between April and November 2021 had to choose between deprecated software (PSPs) and alpha software (PSA or Gatekeeper) to fix this important security issue. I was one of those people, hence this rant :)

## Reason 3: A de-facto standard is not a standard

This is not the first time Kubernetes has left an important niche to third-party software. The Container Runtime Interface (CRI), Container Networking Interface (CNI), Container Storage Interface (CSI), Cloud Controller Manager (CCM), and the Ingress Controller interfaces have all been successful as far as I can tell. These interfaces allow for multiple vendors to supply compatible plugins that users can (more or less) switch between easily. But no such standard interface was created for PodSecurityPolicies, and so the ecosystem is now fragmented.

While Gatekeeper is officially "graduated" according to the CNCF (Kubernetes' parent organization), a startup named Nirmata develops [Kyverno](https://github.com/kyverno/kyverno), which is almost equally popular and fills the same niche as Gatekeeper as a PSP replacement. Gatekeeper and Kyverno have wildly incompatible policy languages, which means application vendors can no longer ship PSP-related rule exceptions along side their applications like they can with e.g. Ingresses, NetworkPolicies, etc.

So if you want to install e.g. a log collector, you can't just `helm install` it anymore like you could if the helm chart included PSPs. You have to go tweak your Gatekeeper/Kyverno policies over and over until the pods finally run. And now you are locked-in to either Gatekeeper or Kyverno's policy language.

## Reason 4: This has already caused a zero-day

In Kubernetes v1.23, [ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) were enabled by default. This presents a challenge to Gatekeeper/Kyverno since its one extra field in a Pod that they need to validate.

Unfortunately, at the time of writing Gatekeeper's PSP replacement policies [still do not validate ephemeral containers](https://github.com/open-policy-agent/gatekeeper-library/issues/188)! Any v1.23 cluster which migrated from PSPs to Gatekeeper now has no protection against privileged pods! That's a 5+ month lag time! [Another user](https://xenitab.github.io/blog/2022/04/12/ephemeral-container-security/) found that Kyverno also had a [1 month lag time](https://github.com/kyverno/kyverno/releases/tag/v1.5.3).

In contrast, both PSPs and PSA were updated to check ephemeral containers before v1.23 was released (PSPs: [`util.go`](https://github.com/kubernetes/kubernetes/pull/59416/files#diff-40853a2fe474b6bde454934dc4e0742a3d9bbf98c31336d8d74520ebe8a2e300R48). PSA: [`visitor.go`](https://github.com/kubernetes/kubernetes/blob/v1.22.0/staging/src/k8s.io/pod-security-admission/policy/visitor.go#L34)). This is the benefit of being "in-tree" that Gatekeeper/Kyverno can't have. If there was at least a standard interface like CSI/CRI/CNI, that may have helped prevent this.

## Takeaways

I want to clarify that I don't think less highly of the various parties involved in the PSP deprecation process. PSPs did require *some* kind of change, and sig-auth's reasoning at the time was solid. I'm only able to make my argument with the clarity of hindsight.

Since it's too late to stop the PSP deprecation anyway ([merged 4 days ago](https://github.com/kubernetes/kubernetes/pull/109798)), I intend this post to just be a post-mortem, with the following lessons-learned:

1. Don't be afraid to make backwards-incompatible changes to beta APIs, especially if it's in the name of security.
2. Deeply consider how the whole ecosystem will react to a given change since it moves so slowly.
3. Learn from the success of the "Container * Interfaces". They can prevent ecosystem fragmentation and compatibility issues.
