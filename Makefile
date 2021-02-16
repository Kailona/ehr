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
	tar --exclude=$(project_dir)/.git \
	--exclude=$(appstore_dir) \
	--exclude=$(project_dir)/.development \
	--exclude=$(project_dir)/.github \
	--exclude=$(project_dir)/.tx \
	--exclude=$(project_dir)/.webpack \
	--exclude=$(project_dir)/contribute \
	--exclude=$(project_dir)/node_modules \
	--exclude=$(project_dir)/screenshots \
	--exclude=$(project_dir)/website \
	--exclude=$(project_dir)/.gitignore \
	--exclude=$(project_dir)/.travis.yml \
	--exclude=$(project_dir)/CODE_OF_CONDUCT.md \
	--exclude=$(project_dir)/lerna.json \
	--exclude=$(project_dir)/Makefile \
	--exclude=$(project_dir)/package.json \
	-cvzf $(appstore_dir)/$(package_name).tar.gz $(project_dir)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(appstore_dir)/$(app_name).tar.gz | openssl base64
