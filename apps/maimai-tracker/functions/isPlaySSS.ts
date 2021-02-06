export const isPlaySSS = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png',
  ]
  
  console.log(imageFlags)

  return !(
    acceptUrls.map(url => imageFlags.includes(url ?? '')).filter(o => o === true).length === 0
  )
}
