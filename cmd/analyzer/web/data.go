package web

import (
	"fmt"
	"math"
	"math/rand"
	"strings"

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

func generatePetName(upper bool) string {
	name := petname.Generate(2, "_")
	if upper {
		return strings.ToUpper(name)
	}
	return name
}

// 计算两点之间的距离
func distance(point1, point2 [2]float64) float64 {
	return math.Sqrt(math.Pow(point1[0]-point2[0], 2) + math.Pow(point1[1]-point2[1], 2))
}

// 生成随机坐标
func generateGroupCoordinates(groups, nodesPerGroup int, distance float64) [][][2]float64 {
	var allCoordinates [][][2]float64

	for groupID := 0; groupID < groups; groupID++ {
		var groupCoordinates [][2]float64
		for nodeID := 0; nodeID < nodesPerGroup; nodeID++ {
			var x, y float64
			if nodeID == 0 {
				// First random coordinate(base coordinate)
				x = float64(groupID*100) + rand.Float64()*1000
				y = float64(groupID*100) + rand.Float64()*1000
				fmt.Println("base coordinate: ", x, y)
			} else {
				prevX := groupCoordinates[nodeID-1][0]
				prevY := groupCoordinates[nodeID-1][1]
				x = prevX + (rand.Float64()-0.5)*200
				y = prevY + (rand.Float64()-0.5)*200
				fmt.Println(x, y)
			}
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
	// xRange := [2]float64{-1000, 1000}
	// yRange := [2]float64{-1000, 1000}
	minDistance := 20.0

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
