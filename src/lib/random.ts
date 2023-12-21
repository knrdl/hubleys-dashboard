import crypto from 'crypto'

export const chooseRandom = (items: unknown[]) => items[Math.floor(Math.random() * items.length)]

export const genRandomId = () => crypto.randomUUID()
