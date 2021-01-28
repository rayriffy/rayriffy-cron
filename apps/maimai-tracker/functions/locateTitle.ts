import { Title } from '../@types/Title'

export const locateTitle = (titleName: string, titles: Title[]) =>
  titles.find(area => area.Name === titleName)
