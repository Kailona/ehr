# Makefile for building the project

app_name=ehr
project_dir=$(CURDIR)
build_dir=$(project_dir)/build
appstore_build_dir=/tmp/build
appstore_sign_dir=/tmp/sign
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
	node node_modules/.bin/webpack-dev-server --public localhost:3000 --inline --hot --port 3000 --host=0.0.0.0 --disable-host-check --useLocalIp --config .webpack/dev.config.js

appstore: clean build/main.js package

package: build/appstore
build/appstore: build/main.js $(othersources)
	rm -rf $(appstore_build_dir)
	mkdir -p $(appstore_build_dir)
	rm -rf $(appstore_sign_dir)
	mkdir -p $(appstore_sign_dir)
	rsync -a \
	--exclude=.git \
	--exclude=.idea \
	--exclude=.development \
	--exclude=.github \
	--exclude=.tx \
	--exclude=.webpack \
	--exclude=contribute \
	--exclude=node_modules \
	--exclude=screenshots \
	--exclude=tests \
	--exclude=website \
	--exclude=.eslintrc \
	--exclude=.gitignore \
	--exclude=.prettierrc \
	--exclude=.travis.yml \
	--exclude=CODE_OF_CONDUCT.md \
	--exclude=lerna.json \
	--exclude=Makefile \
	--exclude=composer.* \
	--exclude=babel.config.js \
	--exclude=netlify.toml \
	--exclude=package.json \
	--exclude=postcss.config.js \
	--exclude=yarn.lock \
	../$(app_name) $(appstore_sign_dir)
	@if [ -f $(cert_dir)/$(app_name).key ]; then \
		sudo chown $(webserveruser) $(appstore_sign_dir)/$(app_name)/appinfo ;\
		sudo -u $(webserveruser) php $(occ_dir)/occ integrity:sign-app --privateKey=$(cert_dir)/$(app_name).key --certificate=$(cert_dir)/$(app_name).crt --path=$(appstore_sign_dir)/$(app_name)/ ;\
		sudo chown -R $(USER) $(appstore_sign_dir)/$(app_name)/appinfo ;\
	else \
		echo "!!! WARNING signature key not found" ;\
	fi
	tar -czf $(appstore_build_dir)/$(app_name)-$(version).tar.gz -C $(appstore_sign_dir) $(app_name)
	@if [ -f $(cert_dir)/$(app_name).key ]; then \
		openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(appstore_build_dir)/$(app_name)-$(version).tar.gz | openssl base64 | tee $(appstore_sign_dir)/sign.txt ;\
	fi
