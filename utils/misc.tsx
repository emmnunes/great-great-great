const shuffleArray = (a: string[]) => {
  let j: number, x: string, i: number;

  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const getMobileOS = () => {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) {
    return "Android"
  }
  else if ((/iPad|iPhone|iPod/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return "iOS"
  }
  return "Other"
}


export { shuffleArray, clamp, getMobileOS }
