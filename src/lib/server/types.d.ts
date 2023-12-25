export interface RequestUserInfo {
  userid: string
  email: string | null
  username: string | null
  groups: string[]
  isAdmin: boolean
  lang: string
}
