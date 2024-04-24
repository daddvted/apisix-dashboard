package web

import (
	"bufio"
	"fmt"
	"io/fs"
	"math"
	"math/rand"
	"os"
	"path/filepath"
	"strings"

	"github.com/daddvted/netswatch2/utils"
)

var groupMap, nodeMap map[string]int

func init() {
	groupMap = make(map[string]int)
	nodeMap = make(map[string]int)

}

type Node struct {
	Id    int     `json:"id"`
	Label string  `json:"label"`
	Title string  `json:"title"`
	Group int     `json:"group"`
	Shape string  `json:"shape"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
}

func (n *Node) setDefault() {
	if n.Shape == "" {
		// n.Shape = "circle"
		n.Shape = "dot"
	}
}

type Edge struct {
	From   int    `json:"from"`
	To     int    `json:"to"`
	Arrows string `json:"arrows"`
}

type ServiceTrace struct {
	In  map[string]utils.Set // Map: key->service:port, value->Set of source IPs
	Out utils.Set
}

func generateRandomPointInCircle(centerX, centerY, radius float64) (float64, float64) {
	// Generate random angle
	angle := rand.Float64() * 2 * math.Pi
	// Generate random radius
	r := rand.Float64() * radius
	// Cartesian coordinates
	x := centerX + r*math.Cos(angle)
	y := centerY + r*math.Sin(angle)
	return x, y
}

func generateCenterPointByGroupID(gid int, distance float64) (float64, float64) {
	angle := float64(gid%8) * 0.25
	circle := math.Floor(float64(gid) / float64(8))

	// fmt.Println(gid, angle, circle+1)

	centerX := float64(circle+1) * distance * math.Cos(angle*math.Pi)
	centerY := float64(circle+1) * distance * math.Sin(angle*math.Pi)

	return centerX, centerY
}

func readDirTextFiles(fsys fs.FS) ([]string, error) {
	var texts []string
	var directory = "."

	dir, err := fs.ReadDir(fsys, directory)
	if err != nil {
		return nil, err
	}

	for _, file := range dir {
		// Check file only
		if !file.IsDir() {
			filePath := filepath.Join(directory, file.Name())
			// Read .txt only
			if filepath.Ext(filePath) == ".txt" {
				fileHandle, err := fsys.Open(filePath)
				if err != nil {
					return nil, err
				}
				defer fileHandle.Close()

				// Read file content
				scanner := bufio.NewScanner(fileHandle)
				for scanner.Scan() {
					texts = append(texts, scanner.Text())
				}

			}
		}
	}
	return texts, nil
}

func GenerateServiceMap(dataPath string) map[string]ServiceTrace {
	svcTrace := make(map[string]ServiceTrace)

	fsys := os.DirFS(dataPath)

	texts, err := readDirTextFiles(fsys)
	if err != nil {
		fmt.Println("Error:", err)
		return svcTrace
	}

	for _, text := range texts {
		// Process OUT service
		if strings.Contains(text, "->") {
			arr := strings.Split(text, "->")
			srcIP := arr[0]
			outSvc := arr[1]

			if val, ok := svcTrace[srcIP]; ok {
				// Found service with source IP in service map
				if !val.Out.Has(outSvc) {
					val.Out.Add(outSvc)
				}
			} else {
				// Service with source IP not found, create a new Service,
				// leave "In" field empty
				outSet := utils.NewSet()
				outSet.Add(outSvc)

				svcTrace[srcIP] = ServiceTrace{
					In:  make(map[string]utils.Set),
					Out: *outSet,
				}
			}
		}

		// Process IN service
		if strings.Contains(text, "<-") {
			arr := strings.Split(text, "<-")
			localSvc := arr[0]
			inIP := arr[1]

			dstIP := strings.Split(localSvc, ":")[0]

			//Two level check
			// 1. Check service with dstIP in service map
			// 2. Check "In" field of "Service"
			if val, ok := svcTrace[dstIP]; ok {
				if v, check := val.In[localSvc]; check {
					if !v.Has(inIP) {
						v.Add(inIP)
					}
				} else {
					// fmt.Println(inIP, text)
					newSet := utils.NewSet()
					newSet.Add(inIP)
					svcTrace[dstIP].In[localSvc] = *newSet
				}
			} else {
				newSet := utils.NewSet()
				newSet.Add(inIP)
				in := make(map[string]utils.Set)
				in[localSvc] = *newSet

				svcTrace[dstIP] = ServiceTrace{
					In:  in,
					Out: *utils.NewSet(),
				}
			}
		}
	}

	return svcTrace
}

func getGroupID(target string) int {
	groupID := 0
	if val, ok := groupMap[target]; ok {
		groupID = val
	} else {
		groupID = len(groupMap) + 1
		groupMap[target] = groupID
	}
	return groupID
}

func getNodeID(target string) (int, bool) {
	nodeID := 0
	if val, ok := nodeMap[target]; ok {
		return val, ok
	} else {
		nodeID = len(nodeMap) + 1
		nodeMap[target] = nodeID
		return nodeID, false
	}
}

func GenerateNodeAndEdge(svcMap *map[string]ServiceTrace) ([]Node, []Edge) {
	// Clean groupMap and nodeMap
	groupMap = make(map[string]int)
	nodeMap = make(map[string]int)

	nodes := []Node{}
	edges := []Edge{}
	groupRadius := 200.0
	groupDistance := 1000.0

	for hostIP, svcTrace := range *svcMap {
		// Generate host Node
		gid := getGroupID(hostIP)
		centerX, centerY := generateCenterPointByGroupID(gid, groupDistance)
		x, y := generateRandomPointInCircle(centerX, centerY, groupRadius)

		hostNodeId, exists := getNodeID(hostIP)
		if !exists {
			node := Node{
				Id:    hostNodeId,
				Label: hostIP,
				Title: hostIP,
				Group: gid,
				// Shape: "box",
				X: x,
				Y: y,
			}
			node.setDefault()
			nodes = append(nodes, node)
		}

		// Create nodes and edges from "In" field of ServiceTrace
		for svc, vv := range svcTrace.In {
			centerX, centerY := generateCenterPointByGroupID(gid, groupDistance)
			x, y := generateRandomPointInCircle(centerX, centerY, groupRadius)
			// Create local service node
			svcNodeId, exists := getNodeID(svc)
			if !exists {
				node := Node{
					Id:    svcNodeId,
					Label: svc,
					Title: svc,
					Group: gid,
					X:     x,
					Y:     y,
				}
				node.setDefault()
				nodes = append(nodes, node)
			}

			// Create edges
			for srcIP := range vv.Content {
				nid, exists := getNodeID(srcIP)
				srcGid := getGroupID(srcIP)
				centerX, centerY := generateCenterPointByGroupID(srcGid, groupDistance)
				x, y := generateRandomPointInCircle(centerX, centerY, groupRadius)
				if !exists {
					node := Node{
						Id:    nid,
						Label: srcIP,
						Title: srcIP,
						Group: srcGid,
						X:     x,
						Y:     y,
					}
					node.setDefault()
					nodes = append(nodes, node)
				}
				edge := Edge{
					From:   nid,
					To:     svcNodeId,
					Arrows: "to",
				}
				edges = append(edges, edge)
			}
		}

		// Create nodes and edges from "Out" field of Service Trace
		for remoteSvc := range svcTrace.Out.Content {
			// Create remote service node
			remoteHost := strings.Split(remoteSvc, ":")[0]
			svcGroupID := getGroupID(remoteHost)
			centerX, centerY := generateCenterPointByGroupID(svcGroupID, groupDistance)
			x, y := generateRandomPointInCircle(centerX, centerY, groupRadius)

			svcNodeId, exits := getNodeID(remoteSvc)
			if !exits {
				node := Node{
					Id:    svcNodeId,
					Label: remoteSvc,
					Title: remoteSvc,
					Group: svcGroupID,
					X:     x,
					Y:     y,
				}
				node.setDefault()
				nodes = append(nodes, node)
			}

			// Create edges
			nid, _ := getNodeID(remoteSvc)
			edges = append(edges, Edge{
				From:   hostNodeId,
				To:     nid,
				Arrows: "to",
			})
		}
	}

	return nodes, edges
}
