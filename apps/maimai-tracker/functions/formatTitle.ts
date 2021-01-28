import { Title } from '../@types/Title'

export const formatTitle = (input: Partial<Title>): Title => {
  const defaultMusic: Title = {
    Name: '',
    Rarity: 'Normal',
    Condition: '',
    Obtained: false,
  }

  return {
    ...defaultMusic,
    ...input,
  }
}
