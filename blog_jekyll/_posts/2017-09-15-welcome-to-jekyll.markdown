---
layout: post
title:  "Code example post"
date:   2017-09-15 22:47:08 -0400
categories: technical
---

Code example

{% highlight python %}
# Sample function
def dict_to_tuple_list(input_dict)
    """Converts a dict to a list of 2-tuples"""
    return [(key, val) for key, val in input_dict.items()]

>>> dict_to_tuple_list({'name': 'Python', 'version': 3.6.2})
[('name', 'Python'), ('version', 3.6.2)]
{% endhighlight %}
