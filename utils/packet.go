package utils

import (
	"context"
	"fmt"
	"net"
	"net/netip"
	"os"
	"strconv"
	"strings"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/pterm/pterm"
)

type Capture struct {
	StartPort uint16
	EndPort   uint16
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
	pterm.Debug.Printf("Local port range: %d-%d", portArr[0], portArr[1])

	return portArr[0], portArr[1]
}

func (cap *Capture) InPortRange(port uint16) bool {
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

func (cap *Capture) DisplayInfo(printer *pterm.AreaPrinter) {

	// fmt.Printf("%+v\n", InMap)
	inText := cap.FormatInText()
	outText := cap.FormatOutText()

	// fmt.Printf("%+v\n", inText)
	// fmt.Printf("%+v\n", outText)
	// fmt.Println("------------------------------------")

	// clear()
	// pterm.Debug.Println("Hello, World!")
	printer.Update(pterm.Sprintf(inText + "\n" + outText))
}

func (cap *Capture) SaveToFile() {
	fmt.Println("Saving to file")
}

func (cap *Capture) ParsePacket(ctx context.Context, printer *pterm.AreaPrinter) {
	var eth layers.Ethernet
	var ip4 layers.IPv4
	var ip6 layers.IPv6
	var tcp layers.TCP
	var udp layers.UDP
	var handle *pcap.Handle
	var err error
	// var packInfo PacketInfo

	parser := gopacket.NewDecodingLayerParser(layers.LayerTypeEthernet, &eth, &ip4, &ip6, &tcp, &udp)
	decoded := []gopacket.LayerType{}

	if handle, err = pcap.OpenLive(cap.NIC, 1600, true, pcap.BlockForever); err != nil {
		panic(err)
	}

	if err := handle.SetBPFFilter(cap.Filter); err != nil { // optional
		panic(err)
	}
	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())

	for packet := range packetSource.Packets() {
		select {
		case <-ctx.Done():
			return
		default:
			if err := parser.DecodeLayers(packet.Data(), &decoded); err != nil {
				// fmt.Fprintf(os.Stderr, "Could not decode layers: %v\n", err)
				// fmt.Println(packet)
				continue
			}
			for _, layerType := range decoded {
				// fmt.Println("----", layerType)
				switch layerType {
				case layers.LayerTypeUDP:
					fmt.Println("found UDP layer")
				// case layers.LayerTypeIPv6:
				// 	fmt.Println("    IP6 ", ip6.SrcIP, ip6.DstIP)
				// case layers.LayerTypeIPv4:
				// 	fmt.Println("    IP4 ", ip4.SrcIP, ip4.DstIP)
				case layers.LayerTypeTCP:
					// fmt.Println("found TCP layer")

					// Process IN packet
					if ip4.DstIP.Equal(cap.LocalIP) && !cap.InPortRange(uint16(tcp.DstPort)) {
						addr := netip.AddrFrom4([4]byte(ip4.DstIP))
						addrPort := netip.AddrPortFrom(addr, uint16(tcp.DstPort))

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
					// Process OUT packet
					if ip4.SrcIP.Equal(cap.LocalIP) && !ip4.DstIP.Equal(cap.LocalIP) && cap.InPortRange(uint16(tcp.SrcPort)) {
						remote := fmt.Sprintf("%s:%d", ip4.DstIP.String(), tcp.DstPort)
						if !cap.Out.Has(remote) {
							cap.Out.Add(remote)
						}
					}

					cap.DisplayInfo(printer)
				}
			}

		}
	}
}
