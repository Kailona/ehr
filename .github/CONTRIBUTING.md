## Submitting issues

If you have questions about how to install or use Nextcloud, please direct these to the [Nextcloud Forum][nextcloudforum].
If you have questions about the Nextcloud EHR application, please direct these to the [Kailona Forum][kailonaforum].

### Short version

 * The [**issue template can be found here**][template]. Please always use the issue template when reporting issues.

### Guidelines
* Please search the existing issues first, it's likely that your issue was already reported or even fixed.
  - Go to one of the repositories, click "issues" and type any word in the top search/command bar.
  - You can also filter by appending e.g. "state:open" to the search string.
  - More info on [search syntax within github](https://help.github.com/articles/searching-issues)
* This repository ([Nextcloud EHR](https://github.com/Kailona/ehr/issues)) is *only* for issues within the Nextcloud EHR code.

Help us to maximize the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.

[template]: https://github.com/Kailona/ehr/blob/main/.github/issue_template.md
[nextcloudforum]: https://help.nextcloud.com
[kailonaforum]: https://help.kailona.org

## Contributing to Source Code

Thanks for wanting to contribute source code to Nextcloud EHR. That's great!

Please read the [Developer Documentation][devmanual] to learn the project architecture and structure.

[devmanual]: https://docs.kailona.org

### Sign your work

We use the Developer Certificate of Origin (DCO) as a additional safeguard
for the Nextcloud EHR project. This is a well established and widely used
mechanism to assure contributors have confirmed their right to license
their contribution under the project's license.
Please read [contribute/developer-certificate-of-origin][dcofile].
If you can certify it, then just add a line to every git commit message:

````
  Signed-off-by: Random J Developer <random@developer.example.org>
````

Use your real name (sorry, no pseudonyms or anonymous contributions).
If you set your `user.name` and `user.email` git configs, you can sign your
commit automatically with `git commit -s`. You can also use git [aliases](https://git-scm.com/book/tr/v2/Git-Basics-Git-Aliases)
like `git config --global alias.ci 'commit -s'`. Now you can commit with
`git ci` and the commit will be signed.

[dcofile]: https://github.com/kailona/ehr/blob/main/contribute/developer-certificate-of-origin

## Translations
Please submit translations via [Transifex][transifex].

[transifex]: https://www.transifex.com/nextcloud/nextcloud/ehr
