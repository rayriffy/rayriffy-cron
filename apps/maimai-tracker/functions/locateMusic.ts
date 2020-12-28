import { GameVersion, Music } from '../@types/Music'

export const locateMusic = (
  songName: string,
  version: GameVersion,
  musics: Music[]
) => musics.find(music => music.Name === songName && music.Version === version)
