+++
title = "Tech and the climate crisis"
draft = true
+++

One of the few positive things about Silicon Valley's influence on the tech industry is the slightly-higher-than-average interest in sustainability. But it's a brand of sustainability that you'd expect from a California yuppie where they are really into the green aesthetic unless it gets in the way of their fancy imported coffee, or their startup's bottom line, or (god forbid) the industrial-capitalistic status quo.

As we leave 2024, we're reckoning with both the fever pitch of AI hype and [annual average air temperatures blowing past the critical threshold](https://climate.copernicus.eu/copernicus-second-warmest-november-globally-confirms-expectation-2024-warmest-year) of +1.5 degrees Celsius which was set by the [Paris Agreement](https://en.wikipedia.org/wiki/Paris_Agreement). At these inflection points, effective solutions for the climate crisis are increasingly incompatible with the status quo. So I think it's time to challenge the tech industry to do things that are actually impactful, not just the few things that appeal to venture capitalists.

Let's say you work for a tech company and you're interested in sustainability. You spend eight hours making a high-traffic website more efficient, which in a typical case<sup id="back-1">[1](#1)</sup> could save a little under 3 tons of CO2 per year. Nice! You pat yourself on the back.

During those eight hours, you leave one of 145 million over-sized American homes, get into one of 1.47 billion cars, drive on a few of the 40 million miles of roads that replaced carbon-absorbing forests, sit in your office building cooled by one of 1.5 billion AC units, eat one serving of the 400 million tons of meat consumed annually (which also replaces carbon-absorbing forests). Maybe you say hi to your CEO in the hallway, who [commutes in by private jet twice a week](https://simpleflying.com/starbucks-ceo-private-jet-flights-2024/). Maybe you personally work remotely, don't own a car, eat vegan, etc. but even in 2025 that makes you a rarity. Society at large makes each of those actions difficult; like swimming upstream. Eight hours pass, and the world pumps another 35 million tons of CO2 into the atmosphere. Business as usual continues.

To me, all these tech companies who talk about how they are "innovative" or "disruptive" are anything but that, since they all carefully color inside the lines of extractive capitalism. Optimizing a website also fits comfortably inside those lines since it helps the bottom line. But take one step over the line into helping people or the planet _instead of_ the bottom line and you'll see what your employer really thinks about innovation and disruption.

The automatic defense mechanisms of the status quo kick in...

## Assumptions

I'm assuming that most tech workers reading this are working at an average company and at an average place on the org chart. You likely aren't designing data centers, chips, or widely-deployed software like the Linux kernel or [SQLite](https://www.sqlite.org/mostdeployed.html), just because the tech industry is so large and those fields are so small. Most likely, I think you are working on some web or mobile app with less than 1 million active users. If not, skip ahead to the [second-to-last section](#).

With that assumption, it makes me disappointed to see people considering software efficiency as a serious way to cut down on CO2 emissions. Some people can handle the nuance<sup id="back-1">[1](#1)</sup> but others seem to have a little trouble:

> Imagine a worldwide community of players turning carbon-neutral gaming into a cultural phenomenon, like carbon-intensive gaming is now, but with something **urgent** and **real** to gain [emphasis added]. ([Source](https://theconversation.com/how-a-solar-minecraft-server-is-changing-the-way-we-play-video-games-242473))

>

## But don't data centers use a lot of electricity?

It's true that data centers are numerous and power-hungry. They account for [0.6% of global greenhouse gas emissions](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4424264) as of 2020<sup id="back-2">[2](#2)</sup>, which is [continuing to grow](https://www.technologyreview.com/2024/12/13/1108719/ais-emissions-are-about-to-skyrocket-even-further/) But it's important to put that number into perspective.

First, the world's data centers serve the world's population of Internet users, which has been estimated to be 5.5 billion people. So the per-capita emissions from data centers are tiny, about 22.91 kg CO2e per person per year, which is equivalent to turning on one LED light bulb for about 10 days a year.

Second, data centers are not even the biggest polluters within the Information and Communication Technology (ICT) sector. Sources estimate that data centers account for [16%](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4424264) to [19%](https://theshiftproject.org/wp-content/uploads/2019/03/Lean-ICT-Report_The-Shift-Project_2019.pdf) of emissions from the whole sector. The largest share (57-65%) comes from the production and use of end-user devices like phones, computers, TVs and IoT devices. This makes intuitive sense because there's an order of magnitude more clients than there are servers.

<figure>
  <img src="/blog/2025/ict_emissions.png" alt="A pie chart titled 'Digital energy consumption 2017'. There are 7 slices, and the data center slice accounts for only 19% of the pie."/>
</figure>

Third, improving the efficiency of software does not make the IPCC's [list of most cost-effective solutions](https://www.ipcc.ch/report/ar6/syr/figures/figure-spm-7)<sup id="back-3">[3](#3)</sup>. Paying a bunch of expensive tech workers to shave a few percentage points off of 0.6% of global emissions is just not that cost effective compared to alternative options such as switching to carbon-free energy sources, reducing the "conversion of natural ecosystems" (largely for meat production) or [shifting to plant-based diets](https://qz.com/ipcc-report-on-climate-change-meat-industry-1850261179). Note also that the IPCC is considered to be conservative with their recommendations and wouldn't suggest something actually effective like "abolish extractive capitalism".

<figure>
  <img src="/blog/2025/ar6-spm-7.png" alt="A complex chart from the IPCC's Sixth Assessment Report showing options for mitigating emissions, including their cost-effectiveness and feasibility. The three most cost-effective methods shown are solar power, wind power, and reducing the conversion of natural ecosystems, but the categories are divided strangely and it's open to interpretation."/>
</figure>

## But I don't control a power plant or a farm, I can only control my software

Fair point. Business interests have historically tried to shift the blame onto consumers (recycling, turning off the lights, and using paper staws being notable examples), which is a form of [greenwashing](https://en.wikipedia.org/wiki/Greenwashing) since many major sources of pollution are systemic. So if we set aside everything outside of your immediate control (a subject I'll return to in the next section), what then is the most effective thing you can do personally? [Most Americans drastically underestimate](https://www.nytimes.com/interactive/2022/12/15/opinion/how-reduce-carbon-footprint-climate-change.html) the carbon impact of many things they can control, like 94% not realizing eating a vegan diet is one of the most impactful things you can do personally.

## So what's the problem with focusing on software efficiency?

There's no inherent problem with working on software efficiency, but there's a problem with the way people talk about it which leads to exaggerating its usefulness. In 2024, [global average air temperatures blew past the critical threshold](https://climate.copernicus.eu/copernicus-second-warmest-november-globally-confirms-expectation-2024-warmest-year) of +1.5 degrees Celsius which was a threshold set by the [Paris Agreement](https://en.wikipedia.org/wiki/Paris_Agreement). At this late stage, effective solutions for climate change are increasingly incompatible with the status quo. Quietly working to make some software a little faster is perfectly compatible with the status quo.

It's important not to get too bogged down in these "demand-side" solutions.


---

<span id="1">1<span>[⤴](#back-1): Software engineers often conflate efficiency with climate-consciousness without knowing the real impact. A reasonable example of that would be optimizing a website to take 100ms instead of 200ms per request. Let's say this website handles 1,500 requests per second (about one tenth of the [global backend request rate for Wikipedia](https://grafana.wikimedia.org/d/000000580/apache-backend-timing?orgId=1&var-ops_prom=All)). Every year, you save 150 years of HTTP request processing time, which I'd roughly estimate to be 2754 kg CO2e<sup id="back-4">[4](#4)</sup>. However, it's likely that [induced demand](https://en.wikipedia.org/wiki/Induced_demand) would happen, negating many of the benefits in most situations [except for a few areas](https://pythonspeed.com/articles/software-jevons-paradox/).

<span id="1">1<span>[⤴](#back-1): Honorable mention to [Itamar](https://pythonspeed.com/climatecrisis/) who is one of the few people who can intelligently talk about software efficiency while keeping it contextualized alongside actually-effective solutions like [activism](https://pythonspeed.com/articles/climate-change/).

<span id="2">2<span>[⤴](#back-2): Which I believe is an over-estimate. They estimated the global energy consumption and multiplied that by 0.6 kg CO2e/kWh, a number which came from a 2015 study. In 2023, [Google estimates](https://www.gstatic.com/gumdrop/sustainability/google-2024-environmental-report.pdf) their data center emissions per kWh are `3.4 MtCO2e / 25.3 tWh = 0.134 kg CO2e/kWh` which is about 4.5 times lower.

<span id="3">3<span>[⤴](#back-3): IPCC, 2023: Summary for Policymakers. In: Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change [Core Writing Team, H. Lee and J. Romero (eds.)]. IPCC, Geneva, Switzerland, pp. 1-34, doi: 10.59327/IPCC/AR6-9789291691647.001

<span id="4">4<span>[⤴](#back-4): It's hard to convert compute time into CO2 because you can't simply multiply by the average power usage of a computer (which also varies drastically based on the type of computer, location, and even time of day). You really need the amount of power used to process HTTP requests multiplied by the time spent NOT processing those requests. I used [CodeCarbon](https://mlco2.github.io/codecarbon/index.html) with Python's builtin `http.server` and [`oha`](https://github.com/hatoo/oha) on my M2 Macbook Pro for 60 seconds. Then I ran it again without running `oha` to find the idle usage. `33.86 - 15.5 = 18.36` kg CO2eq/year of emissions for both the client and the server. Perhaps the combination of the inefficient Python server and my energy-efficient laptop balances out this benchmark.
