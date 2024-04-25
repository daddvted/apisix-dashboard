package main

import (
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"

	"github.com/caarlos0/env"
	"github.com/daddvted/netswatch2/cmd/analyzer/web"
	"github.com/daddvted/netswatch2/utils"
	"github.com/gin-gonic/gin"
)

var envParam web.Config

//go:embed static/* templates/*
var f embed.FS

func init() {
	if err := env.Parse(&envParam); err != nil {
		panic(err)
	}
}

func printCurrentEnv() {
	fmt.Println("当前配置环境变量:")
	fmt.Printf("NW2_NETBOX_URL(Netbox地址): %s\n", envParam.Url)
	fmt.Printf("NW2_NETBOX_TOKEN(Netbox API Token): %s\n", envParam.Token)
}

func main() {
	printCurrentEnv()

	httpServer := web.AnalyzerSrv{
		Conf:   envParam,
		Router: gin.Default(),
	}

	tpl := template.Must(template.New("").ParseFS(f, "templates/*.html"))
	httpServer.Router.SetHTMLTemplate(tpl)

	// tplFS, _ := fs.Sub(f, "templates")
	staticFS, _ := fs.Sub(f, "static")
	httpServer.Router.StaticFS("/static", http.FS(staticFS))

	httpServer.Router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title":   "Service Map",
			"version": utils.Version,
		})
	})

	httpServer.Router.GET("/data", httpServer.DataHandler)
	httpServer.Router.GET("/service", httpServer.ServiceHandler)
	httpServer.Router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
