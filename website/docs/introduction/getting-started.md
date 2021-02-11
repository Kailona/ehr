---
id: getting-started
title: Getting Started
slug: /
---

Kailona is an extensible, customizable and secure platform for your private electronic health records (EHR). It is
available as [Nextcloud](https://nextcloud.com) application.

It helps you to organize, manage and visualize your behavioral and health data such as activities, vital signs, blood
pressure, etc. powered by the awesome features of HIPAA and GDPR compliant Nextcloud.

## Installation

Kailona requires a FHIR server to store your health data in a well-known standard for interoperability.

The following steps will install Kailona in your Nextcloud:

1. Setup a FHIR Server in the same or different host of your Nextcloud, as instructed
   [here](/docs/guides/setup-fhir-server).

2. Navigate to **Apps**, choose the category **Organization**, find the **EHR (Electronic Health Records)** app and
   enable it in your Nextcloud.

3. Navigate to **Settings**, select **EHR (Electronic Health Records)** under Admin settings on the left menu and
   configure the FHIR server credentials in your Nextcloud.

4. Open the **EHR** app from the top app menu.

## Configuration

You can configure Kailona with any SSL-enabled FHIR server supporting HTTP Basic Authentication.

In your Nextcloud, Navigate to **Settings**, select **EHR (Electronic Health Records)** under **Administration** on the
left menu and configure your FHIR server credentials.

-   Base URL: The base url with a trailing slash of your SSL-enabled FHIR server
-   Username: The username to authenticate with your SSL-enabled FHIR server
-   Password: The password to authenticate with your SSL-enabled FHIR server

![FHIR Server Configuration](/img/introduction/fhir-configuration.png)

:::caution

Kailona currently supports only HTTP Basic Authentication, so make sure that you use HTTPS in your FHIR server base url
for security purposes!

:::
