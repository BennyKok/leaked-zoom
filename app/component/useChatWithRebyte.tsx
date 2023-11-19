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
  context: string;
  topic: string;
  numberOfAgent: number;
  setContext: (context: string) => void;
  setTopic: (topic: string) => void;
  setNumberOfAgent: (numberOfAgent: number) => void;
};

export const useContextStore = create<Store>((set) => ({
  context: '',
  topic: '',
  numberOfAgent: 2,
  setTopic: (topic: string) => {
    set({ topic })
  },
  setNumberOfAgent: (numberOfAgent: number) => {
    set({ numberOfAgent })
  },
  setContext: (context: string) => {
    console.log(context);
    set({ context })
  },
}));

export function useChatWithRebyte2(agentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const { context, setContext, topic, numberOfAgent } = useContextStore();

  async function chatRebyte() {
    setIsLoading(true);

    const res = await fetch('/api/rebyte', {
      method: 'POST',
      body: JSON.stringify({
        agentId,
        topic,
        numberOfAgent,
        // text: message,
        context: context,
      }),
    }).then(async (res) => res.json());

    let text = res.message;
    setContext(res.context);

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
