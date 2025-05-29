'use client'
import { Suspense } from 'react'

function SearchParamsWrapper({ children }: any) {
  return children
}

export default function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {children}
      </SearchParamsWrapper>
    </Suspense>
  )
}