---
id: deployment
title: Deployment
---

Kailona is a Nextcloud app, so it should be deployed with an instance of Nextcloud.

The following steps will help you to deploy Nextcloud, FHIR server and Kailona:

## Setup Nextcloud instance

For instructions, refer to [here](https://docs.nextcloud.com/server/latest/admin_manual/index.html)

## Setup FHIR server

For instructions, refer to [here](/docs/guides/setup-fhir-server)

## Setup Kailona

You can easily build Kailona and deploy it into your Nextcloud instance using the following steps:

1. Clone [this repository](https://github.com/Kailona/ehr) that includes the Kailona source code

```bash
cd {path-to-nextcloud-folder}/apps/
git clone https://github.com/Kailona/ehr
```

2. Build the source code

```bash
make
```

3. In your Nextcloud, navigate to **Apps**, find **EHR (Electronic Health Records)** and enable it.
