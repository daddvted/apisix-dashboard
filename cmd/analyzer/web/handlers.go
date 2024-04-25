package web

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type serviceJson struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type netboxItem struct {
	Id int `json:"id"`
}

type customField struct {
	Subsystem string `json:"subsystem"`
}
type netboxService struct {
	Name        string      `json:"name"`
	CustomField customField `json:"custom_fields"`
}

type netboxResult struct {
	Count int `json:"count"`
	// Results []map[string]netboxItem
	Results []netboxItem
}

type netboxServiceResult struct {
	Count   int             `json:"count"`
	Results []netboxService `json:"results"`
}

func (a *AnalyzerSrv) invokeNetboxAPI(url string) []byte {
	data := []byte{}

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return data
	}

	request.Header.Set("Authorization", "Token "+a.Conf.Token)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Printf("request failed: %v\n", err)
		return data
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("read response failed: %v\n", err)
		return data
	}
	return body
}

func (a *AnalyzerSrv) queryNetboxByIP(ip string) (string, int) {
	vm_api := "/api/virtualization/virtual-machines/?q="
	device_api := "/api/dcim/devices/?q="

	result := netboxResult{}
	url := fmt.Sprintf("%s%s%s", a.Conf.Url, device_api, ip)
	resp := a.invokeNetboxAPI(url)

	if err := json.Unmarshal(resp, &result); err != nil {
		panic(err)
	}

	if result.Count != 0 {
		// fmt.Println("found device")
		return "device", result.Results[0].Id
	}

	url = fmt.Sprintf("%s%s%s", a.Conf.Url, vm_api, ip)
	resp = a.invokeNetboxAPI(url)
	if err := json.Unmarshal(resp, &result); err != nil {
		panic(err)
	}
	if result.Count != 0 {
		// fmt.Println("found vm")
		return "vm", result.Results[0].Id
	}

	return "", 0
}

func (a *AnalyzerSrv) queryNetboxService(ip, port string) netboxServiceResult {
	var svcAPI string
	var svcResult netboxServiceResult
	item, id := a.queryNetboxByIP(ip)
	if id != 0 {
		// "/api/ipam/services/?port=10011&virtual_machine_id=5"
		url := fmt.Sprintf("%s/api/ipam/services/?port=%s", a.Conf.Url, port)

		if item == "device" {
			svcAPI = fmt.Sprintf("%s&device_id=%d", url, id)
		} else {
			svcAPI = fmt.Sprintf("%s&virtual_machine_id=%d", url, id)
		}

		svc := a.invokeNetboxAPI(svcAPI)

		if err := json.Unmarshal(svc, &svcResult); err != nil {
			panic(err)
		}

	}
	return svcResult
}

func (a *AnalyzerSrv) DataHandler(c *gin.Context) {
	svcMap := GenerateServiceMap("data")
	nodes, edges := GenerateNodeAndEdge(&svcMap)

	// fmt.Println("----- node map", len(nodeMap), nodeMap)

	fmt.Printf("nodes: %d, edges: %d\n", len(nodes), len(edges))
	// fmt.Println(edges)

	json := serviceJson{
		Nodes: nodes,
		Edges: edges,
	}
	c.JSON(http.StatusOK, json)
}

func (a *AnalyzerSrv) ServiceHandler(c *gin.Context) {

	ip := c.Query("ip")
	port := c.Query("port")

	c.JSON(http.StatusOK, a.queryNetboxService(ip, port))
}
