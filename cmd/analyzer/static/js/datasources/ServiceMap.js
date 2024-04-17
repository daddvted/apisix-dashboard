// These variables will be injected into a page that will use them.
/* eslint no-unused-vars: "off" */
// Const won't work here, only var.
/* eslint no-var: "off" */

// create an array with edges
var edges = [
  { from: 100, to: 3 },
  { from: 100, to: 4 },
  { from: 100, to: 5 },
  { from: 101, to: 1 },
]

var nodes = [
  {
    id: 1,
    label: "192.168.2.98:8001",
    title: "服务-1",
    group: 1,
    x: 53.32977949558231, 
    y: 42.32201688682496
  },
  {
    id: 2,
    label: "192.168.2.98:8002",
    title: "服务-2",
    group: 1,
    x: 19.216782542032274, 
    y: 48.95776242126947
  },
  {
    id: 100,
    label: "192.168.2.98",
    title: "Host",
    group: 1,
    x: 55.33117084461371, 
    y: 46.00021819558934
  },
  {
    id: 3,
    label: "192.168.2.99:8003",
    title: "服务-3",
    group: 2,
  },
  {
    id: 4,
    label: "192.168.2.99:8004",
    title: "服务-4",
    group: 2,
  },
  {
    id: 5,
    label: "10.0.0.1:80",
    title: "Nginx",
    group: 3,
    x: 100,
    y: 200
  },
  {
    id: 101,
    label: "10.0.0.1",
    title: "Host",
    group: 3,
    x: 100,
    y: 300,
  },
  {
    id: 7,
    label: "192.168.6.6",
    title: "Host",
    group: 4,
    x: 1,
    y: 500
  },
]