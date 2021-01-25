import { Browser } from 'puppeteer'
import Promise from 'bluebird'
import { TaskQueue } from 'cwait'

export const createPage = (
  browser: Browser,
  browserQueue: TaskQueue<typeof Promise>
) => browserQueue.wrap(() => browser.newPage())
