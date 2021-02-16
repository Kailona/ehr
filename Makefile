# Makefile for building the project

app_name=ehr
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(project_dir)/build
appstore_dir=$(build_dir)/appstore
package_name=$(app_name)
cert_dir=$(HOME)/.nextcloud/certificates
webpack=node_modules/.bin/webpack

jssources=$(wildcard js/*) $(wildcard js/*/*) $(wildcard css/*/*) $(wildcard css/*)
othersources=$(wildcard appinfo/*) $(wildcard css/*/*) $(wildcard controller/*/*) $(wildcard templates/*/*) $(wildcard log/*/*)

all: build/main.js

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

node_modules: package.json
	yarn config set workspaces-experimental true
	yarn install

build/main.js: node_modules $(jssources)
	yarn lint
	$(webpack) --verbose --colors --display-error-details --config .webpack/prod.config.js

.PHONY: watch
watch: node_modules
	node node_modules/.bin/webpack-dev-server --public localhost:3000 --inline --hot --port 3000 --config .webpack/dev.config.js

appstore: clean build/main.js package

package: build/appstore/$(package_name).tar.gz
build/appstore/$(package_name).tar.gz: build/main.js $(othersources)
	mkdir -p $(appstore_dir)
	tar -C $(project_dir)/.. \
	--exclude=$(app_name)/.git \
	--exclude=$(app_name)/.idea \
	--exclude=$(app_name)/build/appstore \
	--exclude=$(app_name)/.development \
	--exclude=$(app_name)/.github \
	--exclude=$(app_name)/.tx \
	--exclude=$(app_name)/.webpack \
	--exclude=$(app_name)/contribute \
	--exclude=$(app_name)/node_modules \
	--exclude=$(app_name)/screenshots \
	--exclude=$(app_name)/website \
	--exclude=$(app_name)/.gitignore \
	--exclude=$(app_name)/.travis.yml \
	--exclude=$(app_name)/CODE_OF_CONDUCT.md \
	--exclude=$(app_name)/lerna.json \
	--exclude=$(app_name)/Makefile \
	--exclude=$(app_name)/netlify.toml \
	--exclude=$(app_name)/package.json \
	-cvzf $(appstore_dir)/$(package_name).tar.gz $(app_name)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(appstore_dir)/$(app_name).tar.gz | openssl base64
