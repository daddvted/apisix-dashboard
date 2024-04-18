package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NodeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, fakeNode())
}

func EdgeHandler(c *gin.Context) {
	nodes := fakeNode()
	c.JSON(http.StatusOK, fakeEdge(nodes))
}
