export * from './Events'
export * from './EventsSkeleton'
export * from './Message'
export * from './Stock'
export * from './StockPurchase'
export * from './Stocks'
export * from './StockSkeleton'
export * from './StocksSkeleton'

'use client'

import dynamic from 'next/dynamic'
import { StockSkeleton } from './StockSkeleton'
import { StocksSkeleton } from './StocksSkeleton'
import { EventsSkeleton } from './EventsSkeleton'

const Stock = dynamic(() => import('./Stock').then(mod => mod.Stock), {
  ssr: false,
  loading: () => <StockSkeleton />
})

const Purchase = dynamic(
  () => import('./StockPurchase').then(mod => mod.Purchase),
  {
    ssr: false,
    loading: () => (
      <div className="h-[375px] rounded-xl border bg-zinc-950 p-4 text-green-400 sm:h-[314px]" />
    )
  }
)

const Stocks = dynamic(() => import('./Stocks').then(mod => mod.Stocks), {
  ssr: false,
  loading: () => <StocksSkeleton />
})

const Events = dynamic(() => import('./Events').then(mod => mod.Events), {
  ssr: false,
  loading: () => <EventsSkeleton />
})

export { Stock, Purchase, Stocks, Events }
