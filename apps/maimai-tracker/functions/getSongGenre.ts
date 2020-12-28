import { GameGenre } from "../@types/Music";

export const getSongGenre = (songName: string, directory: { name: string, genre: GameGenre }[]): GameGenre => {
  const res = directory.find(item => item.name === songName)
  
  if (res !== undefined) {
    return res.genre
  } else {
    console.error(`${songName} does not have genre`)
    throw 'no-genre'
  }
}
