---
id: architecture
title: Architecture
---

Kailona is a Nextcloud app with its server components implemented using Nextcloud app development guidelines and client
components implemented as a standalone platform in React.

![Architecture Diagram](/img/development/architecture.svg)

## Project Structure

The main project structure is constructed based on Nextcloud app structure. The client packages are maintained as
[monorepo](https://en.wikipedia.org/wiki/Monorepo), containing many repositories. You can individually use those
packages on your custom apps as well.

```
.
├── appinfo                     # Nextcloud app metadata and configuration
│
├── img                         # Icons and images
│
├── js                          # Client source code
│   ├── platform                # Client platform
│   │   ├── core                # Business logic
│   │   ├── ui                  # UI elements
│   │   └── main                # Main app components
│   │
│   └── plugins                 # Custom plugins
│
├── i10n                        # Translation files
│
├── lib                         # Server business logic, Custom API controllers, FHIR API gateway
│
├── templates                   # Server templates
│
├── tests                       # Server unit tests
│
├── ...                         # Misc. configuration files
│
├── lerna.json                  # MonoRepo (Lerna) settings for client-side packages
├── package.json                # Client package configuration
└── README.md                   # Quick development instructions
```

The `lib` folder contains server-side business logic, Custom API controllers and FHIR API Gateway. The `js` folder
contains all client-side business logic, modules and components.

The `platform` folder contains the client business logic, application components and UI elements. The `main` folder
contains the main application module that combines all other components to create the client application.

The `plugins` folder contains many packages that can be registered in Kailona's config file,
`main/src/config/default.js` to expand the features and functionality of Kailona such as new data types.
