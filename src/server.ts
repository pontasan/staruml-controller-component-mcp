import { createServer, componentTools } from "staruml-controller-mcp-core"

export function createComponentServer() {
    return createServer("staruml-controller-component", "1.0.0", componentTools)
}
