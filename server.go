package main

import (
    "flag"
    "net/http"
    "fmt"
)

var (
    portFlag = flag.Int("port", 8000, "the port number that this server should listen on")
    staticFilesFlag = flag.String("static", "static", "the static file directory")
)

func main() {
    flag.Parse()

    listenAddress := fmt.Sprintf(":%d", *portFlag)

    http.Handle("/", http.FileServer(http.Dir(*staticFilesFlag)))
    http.ListenAndServe(listenAddress, nil)
}
