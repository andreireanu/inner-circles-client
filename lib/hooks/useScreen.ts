import useWindowSize from './useWindowSize'

export enum Screen {
  s = 's',
  m = 'm',
  l = 'l',
}

const SCREEN_WIDTH = {
  s: 0,
  m: 769,
  l: 993,
}

const getScreenFromWidth = (width?: number): Screen | undefined => {
  if (!width) {
    return undefined
  }

  if (width && width >= SCREEN_WIDTH.m) {
    return Screen.m
  }

  if (width && width >= SCREEN_WIDTH.l) {
    return Screen.l
  }

  return Screen.s
}

const useScreen = (): Screen | undefined => {
  const { width } = useWindowSize()
  return getScreenFromWidth(width)
}

export default useScreen
