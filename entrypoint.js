function shutdownGracefully() {
  console.debug('Server shutdown')
  app.server.close()
}

process.on('SIGINT', shutdownGracefully)
process.on('SIGTERM', shutdownGracefully)



// See: https://github.com/sveltejs/kit/issues/6841#issuecomment-1330555730

import { server as app } from './index.js' // created by sveltekit on build