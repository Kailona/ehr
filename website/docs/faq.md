---
id: faq
title: FAQ
---

## General

### Why can't I retrieve or update any data?

Kailona requires an SSL-enabled FHIR server, supporting HTTP Basic Authentication. Please ask your administrator to add
FHIR server credentials in Nextcloud admin settings. For more details, refer to our
[documentation](https://docs.kailona.org)

### Why can't I request data?

Please ask your administrator to configure SMTP server in Nextcloud admin settings, and make sure that you entered your
email address in your Nextcloud profile. For more details, refer to [Nextcloud documentation][nextcloud-smtp]

[nextcloud-smtp]:
    https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/email_configuration.html#email

## Data

### What types of file can I import into plugins?

Kailona currently supports for importing [TCX](https://en.wikipedia.org/wiki/Training_Center_XML) files into
`Activities` plugin.

### Do you have any integration for automatic data import?

No, but it is already in the roadmap. Any contribution would be greatly appreciated.
