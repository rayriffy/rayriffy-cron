import { ArrayStringBoolean } from '../@types/ArrayStringBoolean'

export const stringArrayBooleanToBoolean = (input: ArrayStringBoolean) =>
  input[0] === 'true'
