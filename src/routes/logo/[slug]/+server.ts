import { dev } from '$app/environment'
import { error, redirect } from '@sveltejs/kit'
import fs from 'node:fs'
import { opendir } from 'node:fs/promises'
import path from 'node:path'
import { lookup } from 'mrmime'
import { env } from '$env/dynamic/private'

async function getFilename({ fspath, filename, uapath }: { fspath: string; filename: string; uapath?: string }) {
  try {
    for await (const e of await opendir(fspath)) {
      const p = path.parse(e.name)
      if (e.isFile() && (p.base === filename || p.name === filename)) return path.join(uapath || fspath, p.base)
    }
  } catch (e) {
    console.error(e)
  }
}

export async function GET({ params }) {
  const filename = path.basename(params.slug)

  const job1 = getFilename({ fspath: env.LOGOS_DIR!, filename })
  const job2 = getFilename({ fspath: dev ? 'static/fallback-logos' : 'client/fallback-logos', uapath: '/fallback-logos', filename })

  const path1 = await job1
  if (path1)
    return new Response(fs.createReadStream(path1) as unknown as ReadableStream, { headers: { 'Content-Type': lookup(path1) || 'application/octet-stream' } })
  const path2 = await job2
  if (path2) redirect(307, path2)
  error(404, 'file not found')
}
