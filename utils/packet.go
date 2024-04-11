package utils

import (
	"context"
	"fmt"
	"net"
	"net/netip"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/pterm/pterm"
)

type Capture struct {
	StartPort uint16
	EndPort   uint16
	Ex        Set
	LocalIP   net.IP
	NIC       string
	Filter    string
	In        InMap
	Out       Set
}

type PacketData struct {
	Ip  layers.IPv4
	Tcp layers.TCP
}

type InMap map[netip.AddrPort]Set

func colorPort(text string) string {
	// text format "ip:port"
	s := strings.Split(text, ":")
	if len(s) < 2 {
		return text
	} else {
		ip := s[0]
		port := s[1]
		return ip + ":" + pterm.Green(port)
	}
}

func GetLocalPortRange() (uint16, uint16) {
	content, err := os.ReadFile("/proc/sys/net/ipv4/ip_local_port_range")
	if err != nil {
		fmt.Println("Get local port range error, use default range 49152-65535")
		return 49152, 65535
	}

	portArr := []uint16{}
	for _, port := range strings.Fields(strings.TrimSpace(string(content))) {
		portInt, err := strconv.ParseUint(port, 10, 16)
		if err != nil {
			fmt.Println("Parse local port range error, use default range 49152-65535")
			return 49152, 65535
		}
		portArr = append(portArr, uint16(portInt))
	}
	pterm.Debug.Printf("Local port range: %d-%d\n", portArr[0], portArr[1])

	return portArr[0], portArr[1]
}

func (cap *Capture) InPortRange(port uint16) bool {
	portStr := strconv.FormatUint(uint64(port), 10)
	if cap.Ex.Has(portStr) {
		return false
	}
	if port < cap.StartPort || port > cap.EndPort {
		return false
	}
	return true
}

func (cap *Capture) FormatInText() string {
	text := []string{}
	for local, v := range cap.In {
		for remote := range v.content {
			tmp := fmt.Sprintf("%15s -> %-21s", remote, colorPort(local.String()))
			text = append(text, tmp)
		}
	}
	return strings.Join(text, "\n")
}

func (cap *Capture) FormatOutText() string {
	text := []string{}
	for remote := range cap.Out.content {
		text = append(text, fmt.Sprintf("%19s%-21s -> %-23s", "", cap.LocalIP, colorPort(remote)))
	}
	return strings.Join(text, "\n")
}

func (cap *Capture) DisplayInfo(ctx context.Context, printer *pterm.AreaPrinter) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			sumText := cap.Sum()
			inText := cap.FormatInText()
			outText := cap.FormatOutText()
			printer.Update(pterm.Sprintf(sumText + "\n" + inText + "\n" + outText + "\n"))

			time.Sleep(time.Second * 1)

		}
	}
}

func (cap *Capture) SaveToFile() {
	fmt.Println("Saving to file: data.txt")
	filePath := "data.txt"

	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Println("Unable to open file:", err)
		return
	}
	defer file.Close()

	// Write IN data
	text := []string{}
	for local, v := range cap.In {
		for remote := range v.content {
			tmp := fmt.Sprintf("%s<-%s", local, remote)
			text = append(text, tmp)
		}
	}
	inContent := strings.Join(text, "\n")

	//Write OUT data
	text = []string{}
	for remote := range cap.Out.content {
		text = append(text, fmt.Sprintf("%s->%s", cap.LocalIP, remote))
	}
	outContent := strings.Join(text, "\n")

	_, err = file.WriteString(inContent + "\n" + outContent)
	if err != nil {
		fmt.Println("Unable to write:", err)
		return
	}

}

func (cap *Capture) Sum() string {
	count := 0
	for _, v := range cap.In {
		count += v.Size()
	}

	in := fmt.Sprintf("%s %d", pterm.BgGreen.Sprintf("IN:"), count)
	out := fmt.Sprintf("%s %d\n", pterm.BgGreen.Sprintf("OUT:"), cap.Out.Size())
	return in + ", " + out
}

func (cap *Capture) ParsePacket(ctx context.Context) {

	var handle *pcap.Handle
	var err error

	if handle, err = pcap.OpenLive(cap.NIC, 1600, true, pcap.BlockForever); err != nil {
		pterm.Red(err)
		fmt.Println(pterm.Red(err))
		os.Exit(2)
	}

	if err := handle.SetBPFFilter(cap.Filter); err != nil { // optional
		panic(err)
	}
	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())

	for packet := range packetSource.Packets() {
		// var eth layers.Ethernet
		var ip4 *layers.IPv4
		// var ip6 layers.IPv6
		var tcp *layers.TCP
		var udp *layers.UDP

		select {
		case <-ctx.Done():
			return
		default:
			ipLayer := packet.Layer(layers.LayerTypeIPv4)

			// Only process non-nil IP packet
			if ipLayer != nil {
				ip4, _ = ipLayer.(*layers.IPv4)
				// fmt.Println("ip4: ", ip4.Length)
				tcpLayer := packet.Layer(layers.LayerTypeTCP)
				if tcpLayer != nil {
					tcp, _ = tcpLayer.(*layers.TCP)
					// fmt.Println("tcp: ", len(tcp.Payload))
				}

				udpLayer := packet.Layer(layers.LayerTypeUDP)
				if udpLayer != nil {
					udp, _ = udpLayer.(*layers.UDP)
					// fmt.Println("udp: ", len(udp.Payload))
				}

				if tcp == nil && udp == nil {
					continue
				}

				// Process IN packet
				if ip4.DstIP.Equal(cap.LocalIP) {
					var port uint16
					if tcp != nil && len(tcp.Payload) > 0 {
						port = uint16(tcp.DstPort)
					} else if udp != nil && len(udp.Payload) > 0 {
						port = uint16(udp.DstPort)
					} else {
						continue
					}

					if !cap.InPortRange(port) {

						var addrPort netip.AddrPort
						addr := netip.AddrFrom4([4]byte(ip4.DstIP))
						if tcp != nil {
							addrPort = netip.AddrPortFrom(addr, uint16(tcp.DstPort))
						} else {
							addrPort = netip.AddrPortFrom(addr, uint16(udp.DstPort))
						}

						if val, ok := cap.In[addrPort]; ok {
							ipStr := ip4.SrcIP.String()
							if !val.Has(ipStr) {
								val.Add(ipStr)
							}
						} else {
							set := NewSet()
							set.Add(ip4.SrcIP.String())
							cap.In[addrPort] = *set
						}
					}
				}

				// Process OUT packet
				if ip4.SrcIP.Equal(cap.LocalIP) && !ip4.DstIP.Equal(cap.LocalIP) {
					var port uint16
					if tcp != nil && len(tcp.Payload) > 0 {
						port = uint16(tcp.SrcPort)
						if cap.InPortRange(port) {
							remote := fmt.Sprintf("%s:%d", ip4.DstIP.String(), tcp.DstPort)
							if !cap.Out.Has(remote) {
								cap.Out.Add(remote)
							}
						}
					} else if udp != nil && len(udp.Payload) > 0 {
						port = uint16(udp.SrcPort)
						if cap.InPortRange(port) {
							remote := fmt.Sprintf("%s:%d", ip4.DstIP.String(), udp.DstPort)
							if !cap.Out.Has(remote) {
								cap.Out.Add(remote)
							}
						}
					}
				}
			} //ipLayer != nil

			// cap.DisplayInfo(printer)
		}
	}
}
