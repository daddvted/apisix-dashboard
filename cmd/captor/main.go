package main

import (
	"context"
	"fmt"
	"net"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/caarlos0/env/v10"
	"github.com/daddvted/netswatch2/utils"
	"github.com/pterm/pterm"
)

type EnvParam struct {
	Filter string   `env:"NW2_FILTER" envDefault:"tcp and not port 22"`
	HostIP string   `env:"NW2_HOST_IP" envDefault:"127.0.0.1"`
	NIC    string   `env:"NW2_NIC" envDefault:"eth0"`
	ExPort []string `env:"NW2_EX_PORT" envSeparator:","`
}

var envParam EnvParam

func init() {
	if err := env.Parse(&envParam); err != nil {
		panic(err)
	}
}

func main() {
	pterm.EnableDebugMessages()
	fmt.Println(pterm.Yellow(utils.Version))
	pterm.Info.Println("Ctrl+C to stop")

	area, _ := pterm.DefaultArea.Start()

	localIP := net.ParseIP(envParam.HostIP)
	sport, eport := utils.GetLocalPortRange()

	// Process port exclusion
	exPort := utils.NewSet()
	for _, port := range envParam.ExPort {
		if !exPort.Has(port) {
			exPort.Add(port)
		}
	}

	capture := utils.Capture{
		StartPort: sport,
		EndPort:   eport,
		Ex:        *exPort,
		LocalIP:   localIP,
		NIC:       envParam.NIC,
		Filter:    envParam.Filter,
		In:        utils.InMap{},
		Out:       *utils.NewSet(),
	}

	// In = make(map[netip.AddrPort]utils.Set)
	// Out = *utils.NewSet()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt, syscall.SIGTERM)

	ctx, cancel := context.WithCancel(context.Background())

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		shutdownHandler(ctx, sigs, cancel)
		wg.Done()
	}()

	wg.Add(1)
	// goroutine to parse packet
	go func() {
		capture.ParsePacket(ctx)
		wg.Done()
	}()

	// Goroutine to display packet info
	wg.Add(1)
	go func() {
		capture.DisplayInfo(ctx, area)
		wg.Done()
	}()

	wg.Wait()
	fmt.Println("Exited...")
	area.Stop()

	capture.SaveToFile(envParam.HostIP)

	os.Exit(0)
}

func shutdownHandler(ctx context.Context, sigs chan os.Signal, cancel context.CancelFunc) {
	// Wait for the context do be Done or for the signal to come in to shutdown.
	select {
	case <-ctx.Done():
		fmt.Println("Stopping shutdownHandler...")
	case <-sigs:
		// Call cancel on the context to close everything down.
		cancel()
		fmt.Println("shutdownHandler sent cancel signal...")
	}

	// Unregister to get default OS nuke behaviour in case we don't exit cleanly
	signal.Stop(sigs)
}
