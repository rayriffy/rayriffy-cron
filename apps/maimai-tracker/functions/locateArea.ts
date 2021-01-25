import { Area } from '../@types/Area'

export const locateArea = (areaName: string, areas: Area[]) =>
  areas.find(area => area.Name === areaName)
