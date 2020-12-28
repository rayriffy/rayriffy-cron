export interface Difficulty {
  id: number
  code: 'EAS' | 'ADV' | 'EXP' | 'MAS' | 'REM'
}

export const difficulties: Difficulty[] = [
  { id: 0, code: 'EAS' },
  { id: 1, code: 'ADV' },
  { id: 2, code: 'EXP' },
  { id: 3, code: 'MAS' },
  { id: 4, code: 'REM' },
]
