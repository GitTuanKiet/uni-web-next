import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { validateRequest } from '@/lib/auth'
import { AI, getChat, getMissingKeys } from '@/lib/chat'
import { Chat } from '@/components'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const { user } = await validateRequest()

  if (!user) {
    return {}
  }

  const chat = await getChat(params.id, user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { user, session } = await validateRequest()
  const missingKeys = await getMissingKeys()

  if (!user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== user.id) {
    notFound()
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}