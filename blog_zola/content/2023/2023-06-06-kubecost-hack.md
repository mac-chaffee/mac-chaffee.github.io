+++
title = "Obtaining database passwords from a billion-dollar company"
date = 2023-06-06
+++

This is a story about how in 2021, I discovered a vulnerability affecting an unnamed billion-dollar company and disclosed it to them, earning my largest bug bounty ever!

## Accidental Discovery

At first, I was just doing some work on [kubecost](https://www.kubecost.com/), a Kubernetes tool which estimates costs for running pods. The first thing that caught my security eye was that by default, when you install kubecost, it captures your [HELM_VALUES](https://github.com/kubecost/cost-analyzer-helm-chart/blob/0ef0b20adabfa29b80ab0604a3b51d836eae169b/cost-analyzer/templates/cost-analyzer-deployment-template.yaml#L576) in an environment variable which they use to help their enterprise users debug problems. This set off alarm bells since Helm values are typically how secrets are passed into applications, such as API keys for Kubecost itself and Grafana passwords.

I immediately disabled HELM_VALUES for my own kubecost instance, but now I had my security hat on. While doing unrelated work with my dev tools open, I saw kubecost perform an API request for `/api/allPods`, which happened to be running a little slow (as you can imagine with ~500+ pods). Investigating the response, I saw that it returned ALL of the information about pods, including their environment variables! And this API is callable by unauthenticated users.

It's bad practice to directly use Pod environment variables for secrets (you should use Secrets, [which are secure enough](@/2022/2022-04-30-k8s-secrets.md)). But since the HELM_VALUES environment variable exists, this `/api/allPods` API can be used to obtain at least one or two secrets from KubeCost itself.

At this point, I began writing up a report about the issue to the KubeCost team.

## Thinking like an attacker

While writing the report, I wanted to make sure they would understand the severity of exposing environment variables. Alas, the users of the cluster I administrate are smart and none of them had any secrets in environment variables :)

I remembered a lesson from my security class in college about "[google hacking](https://resources.infosecinstitute.com/topic/google-hacking-overview/)", or just searching for specific strings in Google to find vulnerable servers.

(Un)fortunately, KubeCost's splash page includes enough unique text that I could locate exposed KubeCost instances with a simple Google search. Also (un)fortunately, KubeCost's splash page tells you right away the total estimated monthly cost for a given cluster, which lets you pick a nice juicy target that's burning $20k/month or more of cloud credits.

Only one of the clusters had an identifiable owner, and it happened to be the biggest one, owned by a company with a multi-billion-dollar market cap. I opened up the exposed KubeCost page and went straight to `/api/allPods` and my adrenaline immediately spiked. There were more than 200 passwords (including RDS, Twilio, Google, and Huawei keys) sitting right in front of me, two clicks away from the Google search results.

(here's where I'd put the redacted screenshot if security researchers had legal immunity for responsible disclosure, which we should have)

The cluster name included mentions of gig economy workers so presumably an attacker could have used those keys to steal data from their ~2 million workers.

## Disclosure

Now that I had a handy Google search link that shows the gravity of the KubeCost bug (exposing environment variables), that made writing my KubeCost disclosure easy. I didn't mention the company in my KubeCost disclosure, of course. The fix was implemented after about 2 months (delayed due to KubeCon).

The company has a private bounty program on BugCrowd, where I also filed a report. The affected KubeCost instance was taken down within 3 days and they began rotating API keys.

For my troubles, the KubeCost folks sent me not one but TWO free t-shirts and the billion-dollar company gave me nothing. This has been my biggest bounty so far! Even larger than my other payout of ONE free t-shirt, which I'll write about later. They are good t-shirts to be fair.

The company ghosted me when I requested disclosure, so I'm not mentioning the company name due to [BugCrowd rules](https://www.bugcrowd.com/resources/essentials/standard-disclosure-terms/) that may or may not be legally enforceable. Couldn't even afford to be paid in exposure I guess :)

## Takeaways

* Don't store Kubernetes secrets in environment variables. [Use Secrets](@/2022/2022-04-30-k8s-secrets.md), which generally have tighter RBAC rules around them.
* Don't capture Helm values at install time, they frequently contain secrets.
* Let's all stop selling products that are free, but they don't provide authentication unless you pay. Security should be the default, not an upgrade.
* Be very careful about sites that could possibly by indexed by a search engine, due to the risk of "Google Hacking"
* Responsible disclosure is good for victims, and public disclosure is good for future victims.
