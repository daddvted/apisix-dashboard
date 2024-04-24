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
captor:
	GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build $(LDFLAGS) -o captor ./cmd/captor

analyzer: 
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build $(LDFLAGS) -o analyzer cmd/analyzer/main.go

analyzer-win:
	GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build $(LDFLAGS) -o analyzer.exe cmd/analyzer/main.go

all: captor analyzer analyzer-win

clean:
	rm -f captor analyzer analyzer.exe
