// See: https://github.com/sveltejs/kit/issues/6841#issuecomment-1330555730

import {server as app} from "./index.js"

function shutdownGracefully() {
    console.log("Server shutdown")
    app.server.close()
}

process.on("SIGINT", shutdownGracefully)
process.on("SIGTERM", shutdownGracefully)
