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

	petname "github.com/dustinkirkland/golang-petname"
)

type Node struct {
	Id    int     `json:"id"`
	Label string  `json:"label"`
	Title string  `json:"title"`
	Group int     `json:"group"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
}

type Edge struct {
	From int `json:"from"`
	To   int `json:"to"`
}

type Service struct {
	In  map[string]utils.Set
	Out utils.Set
}

func generatePetName(upper bool) string {
	name := petname.Generate(2, "_")
	if upper {
		return strings.ToUpper(name)
	}
	return name
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

func generateCenterPoint(angle float64, distance float64) (float64, float64) {
	x := distance * math.Cos(angle*math.Pi)
	y := distance * math.Sin(angle*math.Pi)
	return x, y
}

func generateGroupCoordinates(groups, nodesPerGroup int, distance float64) [][][2]float64 {
	var allCoordinates [][][2]float64
	var centerX, centerY float64
	circle := 0

	for groupID := 0; groupID < groups; groupID++ {
		var groupCoordinates [][2]float64
		if groupID == 0 {
			centerX = 0
			centerX = 0
		} else {
			// Clock algo
			m := (groupID - 1) % 8
			if m == 0 {
				circle += 1
			}
			// Use 45° as angle, equals 0.25π
			angle := float64(groupID%8) * 0.25
			centerX, centerY = generateCenterPoint(angle, float64(circle)*distance)
		}
		for nodeID := 0; nodeID < nodesPerGroup; nodeID++ {
			var x, y float64
			x, y = generateRandomPointInCircle(centerX, centerY, 150)
			groupCoordinates = append(groupCoordinates, [2]float64{x, y})
		}
		allCoordinates = append(allCoordinates, groupCoordinates)
	}
	return allCoordinates
}

func fakeNode() []Node {
	nodes := []Node{}
	nodeId := 0
	groupCount := 20
	elementsPerGroup := 5
	minDistance := 600.0

	coordinates := generateGroupCoordinates(groupCount, elementsPerGroup, minDistance)
	for i, group := range coordinates {
		// fmt.Printf("Group %d: %v\n", i+1, group)
		for _, v := range group {
			nodes = append(nodes, Node{
				Id:    nodeId,
				Label: generatePetName(false),
				Title: generatePetName(false),
				Group: i,
				X:     v[0],
				Y:     v[1],
			})
			nodeId += 1
		}
	}
	return nodes
}

func fakeEdge(nodes []Node) []Edge {
	l := len(nodes)
	edges := []Edge{}
	for i := 0; i < 40; i++ {
		from := rand.Intn(l)
		to := rand.Intn(l)

		e := Edge{
			From: from,
			To:   to,
		}

		edges = append(edges, e)

	}
	fmt.Println(edges)

	return edges
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

func AnalyzeService(dataPath string) {
	svcMap := make(map[string]Service)

	fsys := os.DirFS(dataPath)

	texts, err := readDirTextFiles(fsys)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// 	val, ok := svcMap["foo"]
	// // If the key exists
	// if ok {
	//     // Do something
	// }

	for _, text := range texts {
		if strings.Contains(text, "->") {

			tmp := strings.Split(text, "->")
			ip := tmp[0]
			outSvc := tmp[1]

			if val, ok := svcMap[ip]; ok {
				if !val.Out.Has(outSvc) {
					val.Out.Add(outSvc)
				}
			} else {
				svcMap[ip] = Service{
					In:  make(map[string]utils.Set),
					Out: *utils.NewSet(),
				}
			}

		}
		if strings.Contains(text, "<-") {
			tmp := strings.Split(text, "<-")
			localSvc := tmp[0]
			inIP := tmp[1]

			ip := strings.Split(localSvc, ":")[0]

			//Two level check
			if val, ok := svcMap[ip]; ok {
				if v, check := val.In[localSvc]; check {
					if !v.Has(inIP) {
						v.Add(inIP)
					}
				} else {
					svcMap[ip].In[localSvc] = *utils.NewSet()
				}
			} else {
				svcMap[ip] = Service{
					In:  make(map[string]utils.Set),
					Out: *utils.NewSet(),
				}
			}
		}
	}
	// fmt.Println(svcMap)
	// fmt.Println(len(svcMap))
	for k, v := range svcMap {
		for svc, vv := range v.In {
			for outer := range vv.Content {
				fmt.Printf("%s<-%s\n", svc, outer)
			}

		}
		fmt.Println(v.Out.Size())
		for out := range v.Out.Content {
			fmt.Printf("%s->%s\n", k, out)
		}
	}
}
