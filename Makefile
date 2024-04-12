.PHONY: test e2e-test cover gofmt gofmt-fix header-check clean tar.gz docker-push release docker-push-all flannel-git

# Default tag and architecture. Can be overridden
#TAG?=$(shell git describe --tags --dirty --always)
#ifeq ($(TAG),)
#	TAG=latest
#endif
#ifeq ($(findstring dirty,$(TAG)), dirty)
#    TAG=latest
#endif

TAG?=$(shell date +%Y%m%d-%H)


#clean:
#	rm -f ninja
#	  -ldflags '-s -w -X "github.com/daddvted/fruitninja/fruitninja.Version=beta-$(TAG)" -extldflags "-static"'

LDFLAGS=-ldflags '-X github.com/daddvted/netswatch2/utils.Version=beta-$(TAG)'
#LDFLAGS=-ldflags "-X main.Version=1.0.0 -X main.BuildTime=$(shell date -u '+%Y-%m-%dT%H:%M:%SZ')"


debug:
	@echo $(TAG)
### BUILDING
build: $(shell find . -type f  -name '*.go')
	LD_LIBRARY_PATH="-L${PWD}/libpcap-1.5.3" \
	CGO_CPPFLAGS="-I${PWD}/libpcap-1.5.3" \
	CGO_LDFLAGS="-static -L${PWD}/libpcap-1.5.3 -lpcap -Wl,-Bdynamic" \
	GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build -o netswatch2 \
	-ldflags '-X github.com/daddvted/netswatch2/utils.Version=beta-$(TAG) -extldflags "-static"'

#captor: $(shell find ./cmd/captor -type f  -name '*.go')
captor: 
	GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build $(LDFLAGS) -o captor cmd/captor/main.go \

analyzer: 
	GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build $(LDFLAGS) -o analyzer cmd/analyzer/main.go \

all: captor analyzer