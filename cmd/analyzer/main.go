package main

import (
	"embed"
	"html/template"
	"io/fs"
	"net/http"

	"github.com/caarlos0/env"
	"github.com/daddvted/netswatch2/cmd/analyzer/web"
	"github.com/daddvted/netswatch2/utils"
	"github.com/gin-gonic/gin"
)

type EnvParam struct {
	Token string `env:"NW2_NETBOX_TOKEN" envDefault:"13151e9e88608aa76ca937d1d6c9fcb7793eecb6"`
	Url   string `env:"NW2_NETBOX_URL" envDefault:"http://192.168.6.140:31868"`
}

var envParam EnvParam

//go:embed static/* templates/*
var f embed.FS

func init() {
	if err := env.Parse(&envParam); err != nil {
		panic(err)
	}
}

func main() {
	// Run HTTP Server
	r := gin.Default()
	tpl := template.Must(template.New("").ParseFS(f, "templates/*.html"))
	r.SetHTMLTemplate(tpl)

	// tplFS, _ := fs.Sub(f, "templates")
	staticFS, _ := fs.Sub(f, "static")
	r.StaticFS("/static", http.FS(staticFS))

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title":   "Service Map",
			"version": utils.Version,
		})
	})

	r.GET("/data", web.DataHandler)
	r.GET("/service", web.ServiceHandler)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
