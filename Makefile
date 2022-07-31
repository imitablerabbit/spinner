PORT=8080
BUILD_NAME=spinner
BUILD_DIR=build

.PHONY: test

# Build entrypoint

build-all: build-dirs build-static build-server

# Build golang files

rwildcard=$(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2))
GO_FILES=$(call rwildcard,spinner,*.go) $(call rwildcard,cmd/spinner,*.go)

build-server: build $(BUILD_DIR)/$(BUILD_NAME)

$(BUILD_DIR)/$(BUILD_NAME): $(GO_FILES) 
	go build -o $(BUILD_DIR)/$(BUILD_NAME) $(GO_FILES)

# Build static files

HTML_FILES=$(wildcard static/html/*)
SCSS_FILES=$(wildcard static/css/*.scss)
JS_FILES=$(wildcard static/scripts/*.js)
DEPS_FOLDER=$(wildcard static/deps)

BUILD_JS_FILES=$(addprefix build/static/scripts/,$(notdir $(JS_FILES:.js=.min.js)))
BUILD_CSS_FILES=$(addprefix build/static/css/,$(notdir $(SCSS_FILES:.scss=.css)))
BUILD_HTML_FILES=$(addprefix build/static/html/,$(notdir $(HTML_FILES)))

build-static: node_modules build-dirs move-deps $(BUILD_JS_FILES) $(BUILD_CSS_FILES) $(BUILD_HTML_FILES) 

build-dirs: build build/static/css build/static/html build/static/scripts

build:
	mkdir ./build

build/static/css:
	mkdir -p ./build/static/css
	
build/static/html:
	mkdir -p ./build/static/html

build/static/scripts:
	mkdir -p ./build/static/scripts

move-deps: build/static/css build/static/scripts
	cp -r $(DEPS_FOLDER)/css/* ./build/static/css
	cp -r $(DEPS_FOLDER)/scripts/* ./build/static/scripts

build/static/scripts/%.min.js: static/scripts/%.js
	./node_modules/.bin/uglifyjs --output $@ $<

build/static/css/%.css: static/css/%.scss
	./node_modules/.bin/sass --style=compressed --no-source-map $< $@

build/static/html/%: static/html/%
	cp $< $@

# Other tools

start: build
	./$(BUILD_DIR)/$(BUILD_NAME) --port=$(PORT) --static=$(BUILD_DIR)/static

deps: node_modules

node_modules:
	npm install --only=production uglify-js sass

clean-all: clean clean-deps

clean: clean-build clean-test

clean-build:
	rm -rf build

clean-deps:
	rm -rf node_modules

clean-test:
	rm -rf test

# Testing

TEST_DIR=test
TEST_BIN=$(TEST_DIR)/bin
TEST_COVER=$(TEST_DIR)/cover

test: test-compile test-run

test-dirs: $(TEST_BIN) $(TEST_COVER)

$(TEST_BIN):
	mkdir -p $(TEST_BIN)

$(TEST_COVER):
	mkdir -p $(TEST_COVER)

test-compile: test-dirs
	for PACKAGE in `go list ./...`; do \
		go test --cover --covermode=count -v -c \
			$${PACKAGE} -o $(TEST_BIN)/`basename $${PACKAGE}.test`; \
	done

test-run: test-dirs
	cd $(TEST_DIR) && \
	for TEST in `find bin/ -name '*.test'`; do \
		FILENAME="`basename -s .test $${TEST}`.cover" && \
		./$${TEST} -test.coverprofile="cover/$${FILENAME}"; \
	done

cover: test-compile test-run $(TEST_COVER)/all.cover test-cover

$(TEST_COVER)/all.cover:
	cd $(TEST_COVER) && \
	rm -f all.cover && \
	COVER_FILES=`find . -name '*.cover'` && \
	echo "mode: count" > all.cover && \
	for COVER in $${COVER_FILES}; do \
		tail -n +2 $${COVER} >> all.cover; \
	done

test-cover: $(TEST_COVER)/all.cover
	go tool cover -html=$(TEST_COVER)/all.cover
