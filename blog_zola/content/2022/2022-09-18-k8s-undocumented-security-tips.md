+++
title = "Undocumented Kubernetes Security Tips"
+++

Securing Kubernetes is complex, so there are quite a few guides out there:

* [CIS Benchmarks for Kubernetes](https://workbench.cisecurity.org/benchmarks/6083) (free account login required)
* [NSA/CISA Kubernetes Hardening Guidance](https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2716980/nsa-cisa-release-kubernetes-hardening-guidance/)
* [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
* [Various](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) [other](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/) [sources](https://www.aquasec.com/cloud-native-academy/kubernetes-in-production/kubernetes-security-best-practices-10-steps-to-securing-k8s/)

I hate to break it to you, but following all those guides and patching every CVE still might not be enough. There are some security practices which kinda don't fit into these guides, don't get reported as CVEs, and just exist in the minds of expensive consultants.

The fast proliferation of Kubernetes has meant that many more organizations are running Kubernetes without the personnel or the money to secure it properly. And yes, that includes you, "person who is primarily a developer, but deployed an GKE cluster 6 months ago while following the CIS benchmarks and hasn't looked at it since, thinking it's super secure because it's 'managed' by Google". Hopefully this collection of tips will help out those people!

## 1 - A secure cluster needs a secure organization

This tip might be the hardest to hear for often-introverted software folks. You can't achieve excellent security though technology alone; you also need to deal with *people*.

I went through ISO-27001/27002 compliance at a previous company, and that standard is mainly devoted to organizational changes. Since the ISO standards are super-expensive PDFs, here are just a few fair-use points:

* **Establish and enforce policies:** There are [open-source libraries](https://github.com/open-policy-agent/gatekeeper-library) of Kubernetes-related policies, but your organization might need custom policies like "Public-facing Ingresses require a security review" or "Access to (some sensitive namespace) requires approval". And what do you do if someone violates the policy? Termination? Now you have to talk to HR. This stuff might even need to be someone's (or a team's) full-time job.
* **Implement segregation of duties:** If there's valuable data in your cluster, you don't want to have a person with unfettered, un-audited access to a shared cluster-admin token (which is common).
* **Everyone needs security training:** Multiple days need to be set aside to *actually* learn about security. Not just your team, but also the dev team, PMs, and managers. No, reading this blog post does not count, but good question!
* **Periodically review everything:** If you don't [this can happen](https://www.theregister.com/2020/08/26/former_cisco_engineer_aws_webex_teams/).
* **Have an incident management plan:** Preferably one that doesn't take [three weeks](https://www.theregister.com/2022/05/04/heroku_security_communication_dubbed_complete/).

All of these points indicate that running Kubernetes clusters securely is absolutely not something you can "set and forget". You have to be constantly monitoring, patching, educating, documenting, and improving your security posture just to stay afloat.

## 2 - The Kubernetes API has undocumented verbs and subresources

Access to the Kubernetes API is very sensitive, but hard to do right. Roles and ClusterRoles are used to list which "resources" and "verbs" that someone/something can perform. Like `The serviceaccount named 'runner' can 'create' (verb) 'pods' (resource)`.

But *there is no complete list of verbs or subresources anywhere*. As a result, using a wildcard (`*`) in a Role is essentially undefined behavior: you could be granting users the ability to use these undocumented verbs/subresources.

One example is the `escalate` verb on Roles. Accidentally granting this to a user allows them to create new Roles for themselves with more privileges than their existing Role. You might as well have just given them full admin access!

Another example is the `pods/debug` subresource and how it interacts with [ValidatingWebhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/). The `pods/debug` subresource allows users to create [Ephemeral Containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) inside existing pods, but this new subresource could allow you to bypass ValidatingWebhooks that are designed to stop you from running privileged pods. At one point in time, Gatekeeper, Kyverno, and OpenShift SCCs were all vulnerable to this issue. OpenShift SCCs still are, so make sure no one has access to `pods/debug` (the default).

To sum up: pay very close attention to your Roles/ClusterRoles, avoid using wildcards, and watch out for new subresources/verbs in the patch notes. Kubernetes RBAC is a good-but-flawed system that is easy to mess up, and the tooling in this area is still quite immature.


## 3 - Remember that Kubernetes is essentially remote-code-execution-as-a-service

Let's say I create an API where anything you POSTed in the request body would be `eval`'d server-side. That's how you should be thinking of Kubernetes, as "remote code execution as a service" (RCEaaS). Once you accept that, many important conclusions can be drawn:

* **I need to take authentication extremely seriously.** Using ServiceAccount tokens is not enough to secure RCEaaS. I need to tie into a proper identity provider, maybe using [OIDC](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens), maybe with 2FA.
* **I really need some kind of intrusion detection system.** It's very difficult to get proper "defense in depth" for Kubernetes since one slip-up is game over (the attacker gains remote code execution). As a result, you at least need to know when you've been breached. [Falco](https://falco.org/) is one example of a Kubernetes-native IDS.
* **Maybe I shouldn't put all my eggs in one basket.** If one little mistake can lead to RCE, then running multiple clusters may help reduce the blast radius. But be careful: multi-cluster tooling can be complex, so make sure the added complexity isn't just increasing the attack surface for no reason.

With the popularity of Kubernetes and the backing of big companies with huge security teams, it's easy to be lulled into a false sense of security. Having the right mindset can help motivate you to take Kubernetes security as seriously as its RCE-aaS design demands.


## Conclusions

The goal of this post is to spread awareness of the depth that Kubernetes security can reach sometimes. As professionals, it's our duty to communicate the scope of new projects, including the security risks and the work required to mitigate them. All too often, I see this duty being neglected or offloaded to flashy security tools that don't solve the real issues. Because the real issue are often too organization-specific (section 1), too cutting-edge (section 2), or too abstract (section 3) to be documented anywhere.
