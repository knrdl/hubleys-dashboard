// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Sysconfig } from '$lib/server/sysconfig/types'
import type { UserConfig } from '$lib/server/userconfig/types'
import type { RequestUserInfo } from '$lib/server/types'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: RequestUserInfo
      sysConfig: Sysconfig
      userConfig: UserConfig
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { }
