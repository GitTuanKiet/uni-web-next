"use server";

import { validateRequest } from '@/lib/auth/validate-request'
import { Sidebar, ChatHistory } from '@/components'

export async function SidebarDesktop() {
  const { user, } = await validateRequest()

  if (!user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory userId={user.id} />
    </Sidebar>
  )
}