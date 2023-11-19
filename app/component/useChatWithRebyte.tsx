import { useEffect, useState } from 'react';
import { getAIReplyWithEmotion } from '@avatechai/avatars/react';

export function useChatWithRebyte(agentId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');

  async function chatRebyte(message: string) {
    setIsLoading(true);

    const res = await fetch('/api/rebyte', {
      method: 'POST',
      body: JSON.stringify({
        agentId,
        role: 'user',
        messages: message,
      }),
    }).then(async (res) => res.json());

    const [text] = getAIReplyWithEmotion(
      [
        {
          role: 'assisant',
          content: await res.run.results[0][0].value.content,
        },
      ],
      false,
    );
    if (!text) return;

    setText(text);
    setIsLoading(false);
  }

  return { text, chatRebyte, isLoading };
}

import { create } from 'zustand';

type Store = {
  contextCount: number;
  context: string;
  topic: string;
  numberOfAgent: number;
  setContext: (context: string) => void;
  setTopic: (topic: string) => void;
  setNumberOfAgent: (numberOfAgent: number) => void;
  setContextCount: (count: number) => void;
};

export const useContextStore = create<Store>((set) => ({
  context: '',
  topic: '',
  contextCount: 0,
  numberOfAgent: 2,
  setTopic: (topic: string) => {
    set({ topic })
  },
  setNumberOfAgent: (numberOfAgent: number) => {
    set({ numberOfAgent })
  },
  setContext: (context: string) => {
    set({ context })
  },
  setContextCount: (count) => {
    console.log(count)
    set({contextCount: count})
  }
}));

export function useChatWithRebyte2(agentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const { context, setContext, topic, numberOfAgent, contextCount, setContextCount } = useContextStore();

  async function chatRebyte(opponent: string) {
    setIsLoading(true);

    const res = await fetch('/api/rebyte', {
      method: 'POST',
      body: JSON.stringify({
        agentId,
        topic,
        numberOfAgent,
        opponent,
        // text: message,
        context: context,
      }),
    }).then(async (res) => res.json());

    let text = res.message;
    setContext(res.context);
    setContextCount(contextCount + 1)

    // const [text] = getAIReplyWithEmotion(
    //   [
    //     {
    //       role: 'assisant',
    //       content: await res.run.results[0][0].value.content,
    //     },
    //   ],
    //   false,
    // );
    // if (!text) return;

    setText(text);
    setIsLoading(false);
  }

  return { text, chatRebyte, isLoading };
}
