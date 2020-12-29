import { Page } from 'puppeteer'
import scrollPageToBottom from 'puppeteer-autoscroll-down'

export const scroller = (page: Page) => scrollPageToBottom(page, 600, 50)
