+++
title = "Know your carrying capacity"
+++

Take a second to think through all the "stuff" you have to personally maintain at your job. Here are a few ideas:

* Physical servers or virtual machines
* Internal libraries
* A handful of microservices
* Some test cases you wrote
* CI/CD stuff
* Helper scripts
* Open-source repos
* Security/legal compliance
* Software licenses
* All of the tools on your computer (IDE+extensions, shell+extensions, CLI tools, SSH/GPG keys, etc.)

Some less obvious ones:

* Membership in ActiveDirectory groups or equivalent
* Membership in an email alias or chat group
* A chatbot (including the one-click installable ones)
* All those little no-code, IFTT-type things
* Some internal wiki pages
* Meeting series' or working groups


Depending on company size, pretty much any one of these bullet points could be someone's full-time job, but it's not uncommon to see one person having to do a little of all of these (I sure do).

I like to think of the collection of things that someone can reasonably maintain as their "*[carrying capacity](https://en.wikipedia.org/wiki/Carrying_capacity)*", to borrow the ecology term. If you take on more than your carrying capacity, something has to die (aka fall into disrepair). With modern software being so garbage, I think one big reason is that there are too many software professionals out there who don't know their carrying capacity.

Not knowing your carrying capacity can lead to:

* Security issues. All software rots under the deluge of new CVEs these days.
* Productivity issues. That helper script you abandoned had a bug that your co-worker had to fix without any context.
* Usability issues. That microservice you never optimized is making your users mad (but just subtly enough so they don't think to file a bug report, and they experience slow websites all the time so it doesn't affect your bottom line, just slowly eats away at their psyche instead)
* Trust issues. That working group you established (and later neglected) dis-incentivizes future engagement. See also [the Google product graveyard](https://killedbygoogle.com/).
* More fallout from turnover. When an over-capacity employee quits, they explode like a piñata filled with responsibilities that everyone else has to scoop up. Over-capacity employees also likely don't even know the full extent of the responsibilities they do have, meaning some of them just don't get picked up.

So hopefully this post can help avoid those things!


## Odds are that YOU are part of the problem

I'm not talking about people who have been pushed beyond their carrying capacity by other people. You don't need a ton of self-awareness to know when that's what's happening. But when *you* push *yourself* beyond your carrying capacity, you likely won't even notice. And since it's tough to notice (and since so much tech is under-maintained garbage), it's likely you are part of the problem!

Why is it hard to notice when you are beyond your carrying capacity? Well because you can't notice things deteriorating that you don't even actively/regularly think of. If you've worked somewhere for long enough, there's bound to be something you've forgotten about. So many of the building blocks of modern software simply can't alert you when they need maintenance. Documentation won't email you when it becomes obsolete. You won't get immediately sued for every lapse in compliance.

## The solution

All we can really do is to consciously think about our own carrying capacities whenever we take on a new task. Frequently re-visit that "list of things you have to personally maintain" in order to avoid blind spots. When you do this, you might be forced to jog your own memory by re-reading those docs or investigating that old VM. This has the (desireable) side-effect of taking up a lot of your time! If you are already responsible for so many things that you spend so much time re-checking them, you definitely can't take on new things!

All I ask is for just a little bit more conscientiousness when it comes to maintenance.
