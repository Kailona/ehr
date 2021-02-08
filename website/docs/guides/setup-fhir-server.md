---
id: setup-fhir-server
title: Setup FHIR Server
---

An SSL-enabled FHIR server, supporting HTTP Basic Authentication is required to use Kailona.

This guide will install and run open source IBM® FHIR server in Docker container using NGINX reverse proxy. However,
Kailona should work with any other FHIR server in any environment.

## Requirements

1. A host where Docker containers can run

2. A domain or sub domain where the FHIR server can run

3. A web server with reverse proxy capability (e.g. NGINX)

4. A valid SSL certificate for the domain where the FHIR server can run

## Install FHIR Server

1. Clone [this repository](https://github.com/Kailona/kailona-fhir-server) that includes the scripts and config files in
   the host where Docker containers can run

```bash
git clone https://github.com/Kailona/kailona-fhir-server
```

2. Start FHIR server

```bash
cd kailona-fhir-server/
docker-compose up -d --build
```

3. Wait for a few minutes for database initialization and FHIR server startup

4. Set `INITIALIZE_DB` environment variable to **false** in the docker compose file

5. FHIR server should be running on `http://localhost:9080`

6. Restart FHIR server, if needed

```bash
docker-compose down
docker-compose up -d
```

For more detailed instructions, refer to
[IBM FHIR Server User's Guide](https://ibm.github.io/FHIR/guides/FHIRServerUsersGuide)

## Setup NGINX Reverse Proxy

1. Get a domain name and add SSL registration for your domain with [Let's Encrypt](https://letsencrypt.org) to be
   terminated at NGINX. This is critical for security!

2. Replace `fhir.kailona.org` with your domain in the following file and add it into your NGINX configuration file

```
server {
    listen 80;
    server_name fhir.kailona.org;

    location / {
        # enforce https
        return 301 https://$server_name$request_uri;
    }

    location /.well-known {
        alias /var/www/fhir.kailona.org/.well-known;
    }
}

server {
    listen 443 ssl;
    server_name fhir.kailona.org;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/fhir.kailona.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fhir.kailona.org/privkey.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;
    large_client_header_buffers 4 64k;

    location /.well-known {
        alias /var/www/fhir.kailona.org/.well-known;
    }

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;

        proxy_buffer_size 64k;
        proxy_buffers 8 64k;
        proxy_busy_buffers_size 64k;

        proxy_pass http://localhost:9080;
    }
}
```

3. FHIR server should be running on `https://{your-domain}/fhir-server/api/v4/`
