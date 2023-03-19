import crypto from 'crypto'

export const chooseRandom = (items: any[]) => items[Math.floor(Math.random() * items.length)]

export const genRandomId = () => crypto.randomUUID()