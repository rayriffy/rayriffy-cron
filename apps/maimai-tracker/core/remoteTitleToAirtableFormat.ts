import { Title } from '../@types/Title'
import { getEncryptedTitle } from '../utils/getEncryptedTitle'

export const remoteTitleToAirtableFormat = (
  remoteTitles: string[]
): Title[] => {
  const builtTitles = getEncryptedTitle()

  return builtTitles.map(builtTitle => ({
    Name: builtTitle.name,
    Condition: builtTitle.condition,
    Rarity: builtTitle.type,
    Obtained: remoteTitles.map(o => o.trim()).includes(builtTitle.name.trim()),
  }))
}
