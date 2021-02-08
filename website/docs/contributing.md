---
id: contributing
title: Contributing
---

Kailona is currently under alpha development. Any contribution such as platform improvements, new plugins,
documentation, testing, translation, etc. would be greatly appreciated.

Please read [this section](/docs/development/architecture) to learn the architecture and project structure.

## [Code of Conduct][cocfile]

Please read our [code of conduct][cocfile] for better understanding of what actions will or will not be tolerated.

[cocfile]: https://github.com/Kailona/ehr/blob/main/CODE_OF_CONDUCT.md

## Development Process

### Join our forum

There are many ways to contribute to Kailona. Please join our forum [here](https://help.kailona.org)

### Reporting issues

-   Please search the existing issues first, it's likely that your issue was already reported or even fixed.
    -   Go to one of the repositories, click "issues" and type any word in the top search/command bar.
    -   You can also filter by appending e.g. "state:open" to the search string.
    -   More info on [search syntax within github](https://help.github.com/articles/searching-issues)
-   This repository [EHR](https://github.com/Kailona/ehr/issues) is _only_ for issues within the Kailona app.

Help us to maximize the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.

[template]: https://github.com/Kailona/ehr/blob/main/.github/issue_template.md
[nextcloudforum]: https://help.nextcloud.com
[kailonaforum]: https://help.kailona.org

### Sign your work

We use the Developer Certificate of Origin (DCO) as a additional safeguard for the Nextcloud EHR project. This is a well
established and widely used mechanism to assure contributors have confirmed their right to license their contribution
under the project's license. Please read [contribute/developer-certificate-of-origin][dcofile]. If you can certify it,
then just add a line to every git commit message:

[dcofile]: https://github.com/kailona/ehr/blob/main/contribute/developer-certificate-of-origin

```
  Signed-off-by: Random J Developer <random@developer.example.org>
```

Use your real name (sorry, no pseudonyms or anonymous contributions). If you set your `user.name` and `user.email` git
configs, you can sign your commit automatically with `git commit -s`. You can also use git [aliases][gitaliases] like
`git config --global alias.ci 'commit -s'`. Now you can commit with `git ci` and the commit will be signed.

[gitaliases]: https://git-scm.com/book/tr/v2/Git-Basics-Git-Aliases

### Semantic commit messages

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

**Example**

```
feat: allow overriding of webpack config
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

The various types of commits:

-   `feat`: (new feature for the user, not a new feature for build script)
-   `fix`: (bug fix for the user, not a fix to a build script)
-   `docs`: (changes to the documentation)
-   `style`: (formatting, missing semi colons, etc; no production code change)
-   `refactor`: (refactoring production code, eg. renaming a variable)
-   `test`: (adding missing tests, refactoring tests; no production code change)
-   `chore`: (updating grunt tasks etc; no production code change)

Use lower case not title case!

### Code conventions

#### Style guide

[Prettier](https://prettier.io/) will catch most styling issues that may exist in your code. You can check the status of
your code styling by simply running `npm run prettier`.

However, there are still some styles that Prettier cannot pick up.

#### General

-   **Most important: Look around.** Match the style you see used in the rest of the project. This includes formatting,
    naming files, naming things in code, naming things in documentation.
-   "Attractive"

#### Documentation

-   Do not wrap lines at 80 characters - configure your editor to soft-wrap when editing documentation.

### Build the source

For building, `node` and `npm` are required.

The app can be built using `Makefile`

```
make
```

#### Automatic rebuilding during development

During development the webpack dev server can be used to automatically build the code for every change.

Since the compiled source from the webpack dev server need to be injected in the regular Nextcloud sources a proxy setup
is needed to combine things.

If your local Nextcloud setup runs at http://localhost:8080, an nginx configuration for the proxy would look like the
following:

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

This will run the proxy at `http://localhost:3001/`

With the proxy configured you can start the webpack dev server and specify where the Nextcloud proxy is.

```
PROXY_URL=http://localhost:3001/ make watch
```

Alternativately, Nextcloud and proxy server can be run in Docker for development using the following steps:

-   Create `$HOME/NextcloudWorkspace`, `$HOME/NextcloudWorkspace/db` and `$HOME/NextcloudWorkspace/nextcloud` folder
-   Copy the content of `.development` folder in this repo into the `$HOME/NextcloudWorkspace` folder
-   Run `docker-compose up -d` in the `$HOME/NextcloudWorkspace` folder
-   Wait a bit for Nextcloud initialization
-   Update `$HOME/NextcloudWorkspace/nextcloud/config/config.php` to use `http://localhost:3001` url and enable debug
    mode
-   Clone the repo in the `$HOME/NextcloudWorkspace/nextcloud/apps` folder
-   Run `PROXY_URL=http://localhost:3001/ make watch`
-   Go to `http://localhost:3001` and enable `Electronic Health Records (EHR)` application in Nextcloud

## Translations

Please submit translations via [Transifex][transifex].

[transifex]: https://www.transifex.com/nextcloud/nextcloud/ehr
