export interface Difficulty {
  id: number
  code: 'EAS' | 'ADV' | 'EXP' | 'MAS' | 'REM'
  name: string
}

export const difficulties: Difficulty[] = [
  { id: 0, code: 'EAS', name: 'Easy' },
  { id: 1, code: 'ADV', name: 'Advanced' },
  { id: 2, code: 'EXP', name: 'Expert' },
  { id: 3, code: 'MAS', name: 'Master' },
  { id: 4, code: 'REM', name: 'Remaster' },
]
