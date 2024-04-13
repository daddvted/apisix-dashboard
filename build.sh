#!/usr/bin/env bash

#export PCAPV=1.5.3
#wget http://www.tcpdump.org/release/libpcap-$PCAPV.tar.gz && \
#    tar xvf libpcap-$PCAPV.tar.gz && \
#    cd libpcap-$PCAPV && \
#    ./configure --with-pcap=linux && \
#    make

#CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build --ldflags "-L $PWD/libpcap-$PCAPV -linkmode external -extldflags \"-static\"" -a -o main .

LD_LIBRARY_PATH="-L$PWD/libpcap-1.5.3" \
CGO_CPPFLAGS="-I$PWD/libpcap-1.5.3" \
CGO_LDFLAGS="-static -L$PWD/libpcap-1.5.3 -lpcap -Wl,-Bdynamic" \
CC=/opt/rh/devtoolset-2/root/usr/bin/gcc GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build cmd/captor/main.go
