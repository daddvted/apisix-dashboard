package main

import (
	"context"
	"fmt"
	"net"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"

	"github.com/caarlos0/env/v10"
	"github.com/daddvted/netswatch2/utils"
	"github.com/pterm/pterm"
)

type EnvParam struct {
	Filter  string   `env:"NW2_FILTER" envDefault:"tcp and not port 22 or udp"`
	HostIP  string   `env:"NW2_HOST_IP" envDefault:"127.0.0.1"`
	NIC     string   `env:"NW2_NIC" envDefault:"eth0"`
	MinPort uint16   `env:"NW2_MIN_PORT" envDefault:"10000"`
	ExPort  []string `env:"NW2_EX_PORT" envSeparator:","`
}

var envParam EnvParam

func init() {
	if err := env.Parse(&envParam); err != nil {
		panic(err)
	}
}

func printCurrentEnv() {
	fmt.Println(pterm.Gray("当前配置环境变量:"))
	fmt.Println(pterm.Gray(fmt.Sprintf("NW2_HOST_IP(抓取的本机IP): %s", envParam.HostIP)))
	fmt.Println(pterm.Gray(fmt.Sprintf("NW2_NIC(抓取的网卡名): %s", envParam.NIC)))
	fmt.Println(pterm.Gray(fmt.Sprintf("NW2_FILTER(抓取过滤条件): %s", envParam.Filter)))
	fmt.Println(pterm.Gray(fmt.Sprintf("NW2_MIN_PORT(最小随机端口): %d", envParam.MinPort)))
	fmt.Println(pterm.Gray(fmt.Sprintf("NW2_EX_PORT(如果服务端口大于最小随机端口，将服务端口添加到该变量中，多个端口逗号分隔): %s", strings.Join(envParam.ExPort, ","))))
}

func main() {
	pterm.EnableDebugMessages()
	fmt.Println(pterm.Yellow(utils.Version))
	pterm.Info.Println("Ctrl+C to stop")

	printCurrentEnv()
	fmt.Println(pterm.Gray(fmt.Sprintf("Local port range: %d-%d\n", envParam.MinPort, 65535)))

	area, _ := pterm.DefaultArea.Start()

	localIP := net.ParseIP(envParam.HostIP)

	// Process port exclusion
	exPort := utils.NewSet()
	for _, port := range envParam.ExPort {
		if !exPort.Has(port) {
			exPort.Add(port)
		}
	}

	capture := Capture{
		MinPort: envParam.MinPort,
		MaxPort: 65535,
		Ex:      *exPort,
		LocalIP: localIP,
		NIC:     envParam.NIC,
		Filter:  envParam.Filter,
		In:      InMap{},
		Out:     *utils.NewSet(),
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
