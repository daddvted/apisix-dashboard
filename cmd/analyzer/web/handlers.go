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

func NodeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, fakeNode())
}

func EdgeHandler(c *gin.Context) {
	nodes := fakeNode()
	c.JSON(http.StatusOK, fakeEdge(nodes))
}

func DataHandler(c *gin.Context) {
	svcMap := GenerateServiceMap("data")
	nodes, edges := GenerateNodeAndEdge(&svcMap)
	fmt.Println(len(nodes))
	fmt.Println(len(groupMap), len(nodeMap))
	fmt.Println(nodeMap)
	fmt.Println(groupMap)
	json := serviceJson{
		Nodes: nodes,
		Edges: edges,
	}
	c.JSON(http.StatusOK, json)
}
