import { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'

export interface WindowSize {
  width?: number
  height?: number
}

interface Options {
  debounceTime?: number
}

const useWindowSize = (options?: Options) => {
  const debounceTime = options && options.debounceTime
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    const debouncedHandleResize = debounceTime
      ? debounce(handleResize, debounceTime)
      : handleResize

    window.addEventListener('resize', debouncedHandleResize)

    handleResize()

    return () => window.removeEventListener('resize', debouncedHandleResize)
  }, [debounceTime, setWindowSize])

  return windowSize
}

export default useWindowSize
