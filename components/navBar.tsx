'use client'
import { useUserSnapshotQuery } from '@/hooks/queries'
import { useStorage } from '@/hooks/useStorage'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [token, setToken] = useStorage('hfs_token')
  const { data: userSnapshot } = useUserSnapshotQuery(token)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false)
    }
  }

  function handleLogout() {
    setToken(undefined)
    toast.success('已退出登录，返回登录页')
    router.push('/login')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav
      data-html2canvas-ignore='true'
      className='app-surface-card flex items-center justify-between gap-3 p-3 backdrop-blur-sm md:p-4'
    >
      <Link href={'/'}>
        <Image
          src='/images/logo.png'
          alt='HFS NEXT'
          width={165}
          height={58}
          priority
          className='h-auto w-24 md:w-28'
        />
      </Link>
      <div
        className='relative min-w-0'
        ref={dropdownRef}
      >
        <button
          type='button'
          onClick={toggleDropdown}
          aria-haspopup='menu'
          aria-expanded={dropdownOpen}
          className='flex max-w-[180px] items-center space-x-2 rounded-full border border-transparent px-2 py-1.5 transition-colors focus:outline-hidden hover:bg-gray-50'
        >
          <div
            className='flex min-w-0 gap-1 font-black text-black hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
          >
            <span className='truncate'>
              {userSnapshot ? userSnapshot.linkedStudent.studentName : '？？？'}
            </span>
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.2}
                stroke='currentColor'
                className='size-[16px]'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3'
                />
              </svg>
            </div>
          </div>
        </button>
        {dropdownOpen && (
          <div
            role='menu'
            className='absolute right-0 z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white/95 py-1 shadow-lg backdrop-blur-sm'
          >
            <Link
              role='menuitem'
              className='mx-1 block rounded-lg px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100'
              href={'/settings'}
            >
              设置
            </Link>
            <button
              type='button'
              role='menuitem'
              className='mx-1 block w-full rounded-lg px-4 py-2 text-left text-gray-800 transition-colors hover:bg-gray-100'
              onClick={handleLogout}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
