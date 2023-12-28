import { dev } from '$app/environment'
import { error, redirect } from '@sveltejs/kit'
import fs from 'node:fs'
import { opendir } from 'node:fs/promises'
import path from 'node:path'

async function getFilename({ fspath, filename, uapath }: { fspath: string; filename: string; uapath?: string }) {
  for await (const d of await opendir(fspath)) {
    const p = path.parse(d.name)
    if (p.base === filename || p.name === filename) return path.join(uapath || fspath, p.base)
  }
}

export async function GET({ params }) {
  const filename = path.basename(params.slug)

  const job1 = getFilename({ fspath: '/data/logos/', filename })
  const job2 = getFilename({ fspath: dev ? 'static/fallback-logos' : 'client/fallback-logos', uapath: '/fallback-logos', filename })

  const path1 = await job1
  if (path1) return new Response(fs.createReadStream(path1) as unknown as ReadableStream)
  const path2 = await job2
  if (path2) redirect(307, path2)
  error(404, 'file not found')
}
