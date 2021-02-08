---
id: data-access
title: Data Access
---

The client core package provides several data services to allow you to access FHIR and custom data easily.

## FHIR Service

Kailona has FHIR API Gateway which allows client components to access the FHIR server in a secure way using Nextcloud
security mechanism.

The client components use `FHIRService` class from `@kailona/core` package. For example, you can read a specific
Observation resource from the FHIR service using the following source code:

```javascript
import { FHIRService } from '@kailona/core';

const fhirService = new FHIRService('Observation');
const observation = await fhirService.read('some-observation-id');
```

The constructor of `BaseResourceService` class gets resource type as a parameter. It implements the following methods as
defined in FHIR standard:

-   `transaction`: Update, create or delete a set of resources in a single interaction with the FHIR server
-   `create`: Create a new resource with a server assigned id in the FHIR server
-   `read`: Read the current state of the resource in the FHIR server
-   `vread`: Read the state of a specific version of the resource in the FHIR server
-   `update`: Update an existing resource by its id in the FHIR server
-   `patch`: Update an existing resource by posting a set of changes to it in the FHIR server
-   `delete`: Delete a resource in the FHIR server
-   `history`: Retrieve the change history for a particular resource in the FHIR server
-   `search`: Search the resource type based on some filter criteria in the FHIR server

:::danger FHIR API Gateway automatically sets patient id parameter in all search queries to prevent unauthorized access
in a shared FHIR server! You can setup FHIR server in a tenant infrastructure and use individual tenant for each
Nextcloud user to completely isolate health data.

We would like to accept any contributions and security checks in this area. :::

:::caution FHIR API Gateway automatically replaces URLs in the FHIR responses to allow client components call them
directly. :::

## Base Resource Service

`BaseResourceService` class is a base class which should be overridden before it is used. It is useful for quick data
access of a group of FHIR resources. For example, you can implement a class to manage data with custom mappers using the
following source code:

```javascript
import { BaseResourceService } from '@kailona/core';

export default class MyDataService extends BaseResourceService {
    constructor() {
        super('Observation');
    }

    async fetchData(params) {
        const data = await super.fetchData(params);
        // TODO: Map data
        return data;
    }

    async fetchNextData() {
        const data = await super.fetchNextData();
        // TODO: Map data
        return data;
    }

    async upsertData(data) {
        // TODO: Map data
        return await super.upsertData(data);
    }
}
```

The constructor of `BaseResourceService` class gets resource type as a parameter. It implements the following methods:

-   `hasNextData`: Check whether there is more data to retrieve from the FHIR server, useful for pagination
-   `fetchData`: Retrieve data from the FHIR server
-   `fetchNextData`: Retrieve next data from the FHIR server, useful for pagination
-   `upsertData`: Update the existing data or create if it is new in the FHIR server
-   `removeData`: Remove the data in the FHIR server

## Mail Service

`MailService` class is used to send email based on some workflow such as data request. It implements the following
method:

-   `sendRequestData`: Sends an email to request health data via Nextcloud

## Settings Service

`SettingsService` class is used to retrieve and store application and user settings. It implements the following
methods:

-   `retrieveAdminSettings`: Retrieve admin settings in Nextcloud
-   `saveAdminSettings`: Store admin settings in Nextcloud
