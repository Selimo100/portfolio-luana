import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { hasWebGL } from '../../lib/webgl'

interface GLState {
  /** WebGL is supported and has not failed */
  enabled: boolean
  /** Called when the renderer crashes or loses its context */
  disable: () => void
}

const GLContext = createContext<GLState>({ enabled: false, disable: () => {} })

export function GLProvider({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false)
  const disable = useCallback(() => setFailed(true), [])
  const value = useMemo(() => ({ enabled: !failed && hasWebGL(), disable }), [failed, disable])
  return <GLContext.Provider value={value}>{children}</GLContext.Provider>
}

export const useGL = () => useContext(GLContext)
