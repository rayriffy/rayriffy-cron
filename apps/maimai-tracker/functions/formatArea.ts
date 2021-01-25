import { Area } from '../@types/Area'

export const formatArea = (input: Partial<Area>): Area => {
  const defaultMusic: Area = {
    Name: '',
    'Distance (Km)': 0,
    Completed: false,
  }

  return {
    ...defaultMusic,
    ...input,
  }
}
