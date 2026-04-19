'use client'
import { useCallback, useSyncExternalStore } from 'react'

const LOCAL_EVENT = 'hfs-storage'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(LOCAL_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(LOCAL_EVENT, callback)
  }
}

/**
 * 在 localStorage 中存储和获取值。同 key 的多个实例会自动同步，跨 tab
 * 通过 storage 事件同步。
 */
export const useStorage = (key: string, initialValue?: string) => {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? initialValue
      } catch {
        return initialValue
      }
    },
    () => initialValue,
  )

  const setValue = useCallback(
    (next: string | undefined) => {
      try {
        if (next === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, next)
        }
      } catch (error) {
        console.warn(`写入 localStorage 键 "${key}" 失败:`, error)
      }
      window.dispatchEvent(new Event(LOCAL_EVENT))
    },
    [key],
  )

  return [value, setValue] as const
}
