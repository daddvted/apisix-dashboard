package main

import (
	"net/http"

	"github.com/caarlos0/env"
	"github.com/daddvted/netswatch2/cmd/analyzer/web"
	"github.com/gin-gonic/gin"
)

type EnvParam struct {
	Token string `env:"NW2_NETBOX_TOKEN" envDefault:"13151e9e88608aa76ca937d1d6c9fcb7793eecb6"`
	Url   string `env:"NW2_NETBOX_URL" envDefault:"http://192.168.6.140:31868"`
}

var envParam EnvParam

func init() {
	if err := env.Parse(&envParam); err != nil {
		panic(err)
	}
}

func main() {
	// Run HTTP Server
	r := gin.Default()

	// r.Use(func(c *gin.Context) {
	// 	c.Set("conf", envParam)
	// 	c.Next()
	// })

	r.LoadHTMLGlob("templates/*")
	r.Static("/static", "./static")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Service Map",
		})
	})
	r.GET("/data", web.DataHandler)
	r.GET("/service", web.ServiceHandler)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
