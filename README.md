[monorepo]: https://en.wikipedia.org/wiki/Monorepo


# Nextcloud Electronic Health Records (EHR)

Private Electronic Health Records (EHR) in Nextcloud

### Install the latest stable release manually

 - Download the last pre-build [release](https://github.com/kailona/ehr/releases)
 - Extract the `tar.gz` into the apps folder
 
### Install from source

 - Clone the repo in the apps folder
 - Run `make` in the `ehr` folder

## Developing

For building the app `node` and `npm` are required

### Building

Building the app can be done using the `Makefile`

```
make
```

### Automatic rebuilding during development

During development the webpack dev server can be used to automatically build the code
for every change.

Since the compiled source from the webpack dev server need to be injected in the regular Nextcloud
sources a proxy setup is needed to combine things.

If your local Nextcloud setup runs at http://localhost:8080, an nginx configuration for the proxy
would look like the following:

```
server {
    listen 3001;
    server_name localhost;

    location /apps/ehr/build/main.js {
        proxy_pass http://localhost:3000/build/main.js;
    }
    location /apps/ehr/build/main.css {
        return 404;
    }

    location /build {
        proxy_pass http://localhost:3000;
    }
    location /__webpack_hmr {
        proxy_set_header Host $host;
        proxy_pass http://localhost:3000;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
    }

    location / {
        proxy_set_header Host $host;
        proxy_hide_header Content-Security-Policy;
        proxy_pass http://localhost:8080;
    }
}

```

This will run the proxy at http://localhost:3001/

With the proxy configured you can start the webpack dev server and specify where the
Nextcloud proxy is.

```
PROXY_URL=http://localhost:3001/ make watch
```

Alternativately, Nextcloud and proxy server can be run in Docker for development 
using the following steps:

- Create `$HOME/NextcloudWorkspace`, `$HOME/NextcloudWorkspace/db` and `$HOME/NextcloudWorkspace/nextcloud` folder
- Copy the content of `.development` folder in this repo into the `$HOME/NextcloudWorkspace` folder
- Run `docker-compose up -d` in the `$HOME/NextcloudWorkspace` folder
- Wait a bit for Nextcloud initialization
- Update `$HOME/NextcloudWorkspace/nextcloud/config/config.php` to use `http://localhost:3001` url and enable debug mode
- Clone the repo in the `$HOME/NextcloudWorkspace/nextcloud/apps` folder
- Run `PROXY_URL=http://localhost:3001/ make watch`
- Go to `http://localhost:3001` and enable `Electronic Health Records (EHR)` application in Nextcloud

### Project Structure

The JavaScript packages are maintained as [monorepo][monorepo] containing many repositories.

```
.
├── appinfo                     # Nextcloud App metadata and configuration
│
├── img                         # Icons and images
│
├── js                          # JavaScript files
│   ├── platform                # Platform modules
│   │   ├── core                # Business logic
│   │   ├── ui                  # Generic UI elements
│   │   └── main                # Main app components
│   │
│   └── plugins                 # Custom plugins
│
├── i10n                        # Translation files
│
├── lib                         # PHP classes
│
├── templates                   # PHP templates
│
├── tests                       # PHP unit tests
│
├── ...                         # Misc. configuration files
│
├── lerna.json                  # MonoRepo (Lerna) settings for client-side packages
├── package.json                # Client-side package configuration
└── README.md                   # This file
```
