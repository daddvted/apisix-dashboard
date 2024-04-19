package main

import (
	"net/http"

	"github.com/daddvted/netswatch2/cmd/analyzer/web"
	"github.com/gin-gonic/gin"
)

func main() {
	// Analyze data collected by Captor
	// svcMap := web.GenerateServiceMap("data")
	// web.GenerateNodeAndEdge(&svcMap)

	// Run HTTP Server
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")
	r.Static("/static", "./static")

	r.GET("/node", web.NodeHandler)
	r.GET("/edge", web.EdgeHandler)
	r.GET("/data", web.DataHandler)
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Service Map",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
