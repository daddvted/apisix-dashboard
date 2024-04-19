package web

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type serviceJson struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

func DataHandler(c *gin.Context) {
	svcMap := GenerateServiceMap("data")
	nodes, edges := GenerateNodeAndEdge(&svcMap)

	fmt.Println("----- group map", len(groupMap), groupMap)
	// fmt.Println("----- node map", len(nodeMap), nodeMap)

	fmt.Printf("nodes: %d, edges: %d\n", len(nodes), len(edges))
	fmt.Println(edges)

	json := serviceJson{
		Nodes: nodes,
		Edges: edges,
	}
	fmt.Println(json)
	c.JSON(http.StatusOK, json)
}
