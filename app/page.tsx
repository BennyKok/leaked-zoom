"use client";
import { Toaster, toast } from "sonner";

import { Message, useChat } from "ai/react";
import { getAIReplyWithEmotion, useAvatar } from "@avatechai/avatars/react";
import { ThreeJSPlugin } from "@avatechai/avatars/threejs";
import Image from "next/image";
import {
  GraphBlendshapesService,
  nodeConfigs,
} from "@avatechai/avatars/blendshapes";
import { useEffect, useRef, useState } from "react";
import {
  useChatWithRebyte,
  useChatWithRebyte2,
  useContextStore,
} from "./component/useChatWithRebyte";
import { FaEllipsis } from "react-icons/fa6";

const GlobleBlendshapeService = new GraphBlendshapesService(nodeConfigs);
const GlobleBlendshapeService2 = new GraphBlendshapesService(nodeConfigs);
const GlobleBlendshapeService3 = new GraphBlendshapesService(nodeConfigs);

function Loading() {
  return (
    <div className="w-full flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2.5em"
        height="2.5em"
        viewBox="0 0 24 24"
      >
        <circle cx="4" cy="12" r="3" fill="#888888">
          <animate
            id="svgSpinners3DotsScale0"
            attributeName="r"
            begin="0;svgSpinners3DotsScale1.end-0.25s"
            dur="0.75s"
            values="3;.2;3"
          ></animate>
        </circle>
        <circle cx="12" cy="12" r="3" fill="#888888">
          <animate
            attributeName="r"
            begin="svgSpinners3DotsScale0.end-0.6s"
            dur="0.75s"
            values="3;.2;3"
          ></animate>
        </circle>
        <circle cx="20" cy="12" r="3" fill="#888888">
          <animate
            id="svgSpinners3DotsScale1"
            attributeName="r"
            begin="svgSpinners3DotsScale0.end-0.45s"
            dur="0.75s"
            values="3;.2;3"
          ></animate>
        </circle>
      </svg>
    </div>
  );
}

export default function Home() {
  const start = useRef(false);

  const audioSourceNode1 = useRef<AudioBufferSourceNode>();
  const audioSourceNode2 = useRef<AudioBufferSourceNode>();
  const audioSourceNode3 = useRef<AudioBufferSourceNode>();

  const { setTopic, topic, numberOfAgent, setNumberOfAgent } = useContextStore();

  const [initAvatar1, setInitAvatar1] = useState(false);
  const [initAvatar2, setInitAvatar2] = useState(false);
  const [initAvatar3, setInitAvatar3] = useState(false);

  const audioContextRef = useRef<AudioContext>();
  const audioContextRef2 = useRef<AudioContext>();
  const audioContextRef3 = useRef<AudioContext>();

  const [audioStatus, setAudioStatus] = useState<
    "Preparing" | "Playing" | "Ended"
  >("Ended");
  const [audioStatus2, setAudioStatus2] = useState<
    "Preparing" | "Playing" | "Ended"
  >("Ended");
  const [audioStatus3, setAudioStatus3] = useState<
    "Preparing" | "Playing" | "Ended"
  >("Ended");

  const [userLoad, setUserLoad] = useState(false);
  const [assistantLoad, setAssistantLoad] = useState(false);
  const [steveLoad, setSteveLoad] = useState(false);

  const {
    chatRebyte: append,
    isLoading,
    text: message1,
  } = useChatWithRebyte2("1");

  const {
    chatRebyte: append2,
    isLoading: isLoading2,
    text: message2,
  } = useChatWithRebyte2("2");

  const {
    chatRebyte: append3,
    isLoading: isLoading3,
    text: message3,
  } = useChatWithRebyte2("3");

  const [allMessage, setAllMessage] = useState<ChatGPTMessage[]>([]);
  const [character1Message, setCharacter1Message] = useState<ChatGPTMessage>();
  // {
  //   content: "Test",
  //   role: "role"
  // }
  const [character2Message, setCharacter2Message] = useState<ChatGPTMessage>();
  const [character3Message, setCharacter3Message] = useState<ChatGPTMessage>();

  // const { messages, isLoading, append } = useChat();

  // const {
  //   messages: messages2,
  //   isLoading: isLoading2,
  //   append: append2,
  // } = useChat();

  // const [text, currentEmotion] = getAIReplyWithEmotion(messages, isLoading);

  /**
   * Avatar
   */
  const {
    avatarDisplay,
    availableEmotions,
    connectAudioContext,
    connectAudioNode,
    avatarContext,
  } = useAvatar({
    avatarId: '303464d1-c107-4720-8049-dc11d03813a9',
    // Loader + Plugins
    avatarLoaders: [ThreeJSPlugin],
    scale: 1.22,
    // Style Props
    className: "w-[400px] !h-[400px]",
    onAvatarLoaded: () => {
      setInitAvatar1(true);
    },
  });
  const {
    avatarDisplay: avatarDisplay2,
    avatarContext: avatarContext2,
    connectAudioContext: connectAudioContext2,
    connectAudioNode: connectAudioNode2,
  } = useAvatar({
    avatarId: "2b3c7ae2-921e-42d5-ad80-54bedccff270",
    // Loader + Plugins
    avatarLoaders: [ThreeJSPlugin],
    scale: 1.2,
    // Style Props
    className: "w-[400px] !h-[400px]",
    onAvatarLoaded: () => {
      setInitAvatar2(true);
    },
  });

  const {
    avatarDisplay: avatarDisplay3,
    avatarContext: avatarContext3,
    connectAudioContext: connectAudioContext3,
    connectAudioNode: connectAudioNode3,
  } = useAvatar({
    avatarId: '03094f8a-b866-4701-b2c1-f78bf25d8a65',
    // Loader + Plugins
    avatarLoaders: [ThreeJSPlugin],
    scale: 1.21,
    // Style Props
    className: "w-[400px] !h-[400px]",
    onAvatarLoaded: () => {
      setInitAvatar3(true);
    },
  });

  /**
   * Blendshapes Init
   */
  const blendshapes = avatarContext?.client?.getBlendShapesFromAva();
  useEffect(() => {
    if (!avatarContext?.client || !initAvatar1) return;
    if (Object.entries(blendshapes).length == 0) return;
    GlobleBlendshapeService.setNodeGraph(blendshapes);
    avatarContext?.client.setBlendshapesService(GlobleBlendshapeService);
    setInitAvatar1(false);
  }, [avatarContext?.client, blendshapes, initAvatar1]);

  const blendshapes2 = avatarContext2?.client?.getBlendShapesFromAva();
  useEffect(() => {
    if (!avatarContext2?.client || !initAvatar2) return;
    if (Object.entries(blendshapes2).length == 0) return;
    GlobleBlendshapeService2.setNodeGraph(blendshapes2);
    avatarContext2?.client.setBlendshapesService(GlobleBlendshapeService2);
    setInitAvatar2(false);
  }, [avatarContext2?.client, blendshapes2, initAvatar2]);

  const blendshapes3 = avatarContext3?.client?.getBlendShapesFromAva();
  useEffect(() => {
    if (!avatarContext3?.client || !initAvatar3) return;
    if (Object.entries(blendshapes3).length == 0) return;
    GlobleBlendshapeService3.setNodeGraph(blendshapes3);
    avatarContext3?.client.setBlendshapesService(GlobleBlendshapeService3);
    setInitAvatar3(false);
  }, [avatarContext3?.client, blendshapes3, initAvatar3]);

  /**
   * Audio Context Init
   */
  useEffect(() => {
    if (!initAvatar1) return;
    if (audioContextRef.current) return;
    audioContextRef.current = new AudioContext();
    connectAudioContext(audioContextRef.current);
  }, [initAvatar1]);

  useEffect(() => {
    if (!initAvatar2) return;
    if (audioContextRef2.current) return;
    console.log(avatarContext2?.client);
    audioContextRef2.current = new AudioContext();
    connectAudioContext2(audioContextRef2.current);
  }, [initAvatar2]);

  useEffect(() => {
    if (!initAvatar3) return;
    if (audioContextRef3.current) return;
    console.log(avatarContext3?.client);
    audioContextRef3.current = new AudioContext();
    connectAudioContext3(audioContextRef3.current);
  }, [initAvatar3]);

  /**
   * Chatbox scroll
   */
  useEffect(() => {
    const box = document.getElementById("chatbox");
    if (box) box.scrollTop = box.scrollHeight;
  }, [allMessage, userLoad, assistantLoad]);

  function handleAppend(agentId: string) {
    const opponents = ['1', '2', '3'].filter(id => id !== agentId);
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    const opponent2 = opponents.find(id => id !== opponent);

    const name_ = ['Elon Musk', 'Sam Altman', 'Steve Job'][parseInt(opponent!) - 1]
    const name = ['Elon Musk', 'Sam Altman', 'Steve Job'][parseInt(opponent2!) - 1]

    console.log("Next up: ", name_ + " speak to " + opponent2);

    if(opponent === '1') append(name);
    else if (opponent === '2') append2(name);
    else if (opponent === '3') append3(name);
  }

  /**
   * Audio Play
   */
  useEffect(() => {
    (async () => {
      if (!audioContextRef.current) return;
      setAudioStatus("Preparing");

      if (isLoading) return;
      await fetch(
        `/api/tts?voice_id=${process.env.NEXT_PUBLIC_ELON_MASK_VOICE}&text=${message1}`,
      ).then(async (response) => {
        if (!audioContextRef.current) return;
        // setAssistantLoad(false);
        audioContextRef.current?.resume();
        const val = await response.arrayBuffer();
        const audioSourceNode = audioContextRef.current.createBufferSource();
        const buffer = await audioContextRef.current.decodeAudioData(val);
        audioSourceNode.buffer = buffer;

        // setUserLoad(true);
        while (audioSourceNode2.current !== undefined && audioSourceNode3.current !== undefined) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setCharacter1Message({ content: message1, role: "assistant" });
        allMessage.push({ content: message1, role: "assistant" });

        setAssistantLoad(false);
        setUserLoad(false);

        console.log("Elon Audio Loading ");

        connectAudioNode(audioSourceNode);
        setAudioStatus("Playing");
        audioSourceNode1.current = audioSourceNode;
        audioSourceNode.start();
        // trigger the other character
        handleAppend("1");
        audioSourceNode.onended = () => {
          console.log("Elon Audio Ended ");

          setAudioStatus("Ended");
          audioSourceNode1.current = undefined;

          if (!start.current) return;
          // message1
        };
      });
    })();
  }, [message1, isLoading]);

  useEffect(() => {
    (async () => {
      if (!audioContextRef2.current) return;
      setAudioStatus2("Preparing");

      if (isLoading2) return;
      await fetch(
        `/api/tts?voice_id=${process.env.NEXT_PUBLIC_SAM_ALTMAN_VOICE}&text=${message2}`,
      ).then(async (response) => {
        if (!audioContextRef2.current) return;
        // setUserLoad(false);
        audioContextRef2.current?.resume();
        const val = await response.arrayBuffer();
        const audioSourceNode = audioContextRef2.current.createBufferSource();
        const buffer = await audioContextRef2.current.decodeAudioData(val);
        audioSourceNode.buffer = buffer;

        while (audioSourceNode1.current !== undefined && audioSourceNode3.current !== undefined) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        console.log("Sam Audio Loading ");

        setCharacter2Message({ content: message2, role: "user" });
        allMessage.push({ content: message2, role: "user" });

        connectAudioNode2(audioSourceNode);
        setAudioStatus2("Playing");
        audioSourceNode2.current = audioSourceNode;
        audioSourceNode.start();
        handleAppend("2");
        audioSourceNode.onended = () => {
          console.log("Sam Audio Loaded ");
          setAudioStatus2("Ended");
          audioSourceNode2.current = undefined;
          if (!start.current) return;
          // message2
        };
      });
    })();
  }, [message2, isLoading2]);

  useEffect(() => {
    (async () => {
      if (!audioContextRef3.current) return;
      setAudioStatus3("Preparing");

      if (isLoading3) return;
      await fetch(
        `/api/tts?voice_id=${process.env.NEXT_PUBLIC_SAM_ALTMAN_VOICE}&text=${message3}`,
      ).then(async (response) => {
        if (!audioContextRef3.current) return;
        // setUserLoad(false);
        audioContextRef3.current?.resume();
        const val = await response.arrayBuffer();
        const audioSourceNode = audioContextRef3.current.createBufferSource();
        const buffer = await audioContextRef3.current.decodeAudioData(val);
        audioSourceNode.buffer = buffer;

        while (audioSourceNode1.current !== undefined && audioSourceNode2.current !== undefined) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        console.log("third one Audio Loading ");

        setCharacter3Message({ content: message3, role: "user" });
        allMessage.push({ content: message3, role: "user" });

        connectAudioNode3(audioSourceNode);
        setAudioStatus3("Playing");
        audioSourceNode3.current = audioSourceNode;
        audioSourceNode.start();
        handleAppend("3");
        audioSourceNode.onended = () => {
          console.log("Sam Audio Loaded ");
          setAudioStatus3("Ended");
          audioSourceNode3.current = undefined;
          if (!start.current) return;
          // message2
        };
      });
    })();
  }, [message3, isLoading3]);

  const [started, setStarted] = useState(false);

  const triggerNewChat = async () => {
    setStarted(true);

    start.current = true;

    let firstMessage = "Hey Elon!";
    setCharacter2Message({ content: firstMessage, role: "user" });

    // trigger first
    append('1');

    allMessage.push({ content: firstMessage, role: "user" });
    await fetch(
      `/api/tts?voice_id=${process.env.NEXT_PUBLIC_SAM_ALTMAN_VOICE}&text=${firstMessage}`,
    ).then(async (response) => {
      if (!audioContextRef2.current) return;
      audioContextRef2.current?.resume();
      const val = await response.arrayBuffer();
      const audioSourceNode = audioContextRef2.current.createBufferSource();
      const buffer = await audioContextRef2.current.decodeAudioData(val);
      audioSourceNode.buffer = buffer;
      connectAudioNode2(audioSourceNode);
      setAudioStatus("Playing");
      audioSourceNode.start();
      audioSourceNode.onended = () => {
        setAudioStatus("Ended");
        setAssistantLoad(true);
      };
    });
  };

  /**
   * Main Site
   */
  return (
    <main className="flex min-h-screen items-center justify-around p-24 bg-[#111111]">
      <Toaster />

      {/* <img
        className="top-0 absolute w-full min-h-screen left-0 object-cover"
        src={
          'https://media.discordapp.net/attachments/1175552721496047817/1175555288665968671/upscaler-CleanShot_2023-11-19_at_05.55.232x-2x.png?ex=656ba82d&is=6559332d&hm=8fe9e2f777e6a5f7f87597acbb37c1f132a2ba254020716812616ac22511c097&=&width=2180&height=1228'
        }
      ></img> */}

      <div className="absolute top-20 mx-auto z-40">{topic}</div>

      <img
        className="top-0 absolute w-full left-0 object-cover"
        src="https://cdn.discordapp.com/attachments/1175552721496047817/1175589938876665969/CleanShot_2023-11-18_at_16.14.342x.png?ex=656bc872&is=65595372&hm=dab008be7418e2f74cf5e067274721c8f4ad1c42efde66f89e0af587780463b4&"
      ></img>
      <img
        className="bottom-0 absolute w-full left-0 object-cover"
        src="https://cdn.discordapp.com/attachments/1175552721496047817/1175589814221946921/CleanShot_2023-11-18_at_16.14.022x.png?ex=656bc855&is=65595355&hm=263a1358cdd11e040fd2c50e5b55c2172a4f8f00d6821d04e31eff7dc98a1073&"
      ></img>

      <div className="z-10 w-full h-full flex flex-col gap-4">
        <div className="w-full justify-around flex flex-row mx-auto">
          <div className="max-w-[400px] relative">
            <div className="absolute bg-[#111111] w-full h-[5px] top-0 left-0 z-10"></div>

            {avatarDisplay}
            <div className="w-full mt-2">Elon</div>

            {character1Message && (
              <>
                <div className="bg-white/20 h-[1px] mx-0 my-2"></div>
                <div className="w-full text-opacity-80">
                  {" "}
                  {character1Message.content}
                </div>
              </>
            )}
            {assistantLoad && <Loading />}
          </div>
          <div className="max-w-[400px] relative">
            <div className="absolute bg-[#111111] w-full h-[5px] top-0 left-0 z-10"></div>

            {avatarDisplay2}
            <div className="w-full mt-2">Sam</div>
            {character2Message && (
              <>
                <div className="bg-white/20 h-[1px] mx-0 my-2"></div>
                <div className="w-full text-opacity-80">
                  {" "}
                  {character2Message.content}
                </div>
              </>
            )}
            {userLoad && <Loading />}
          </div>
        {numberOfAgent == 3 && <div className="max-w-[400px] relative">
            <div className="absolute bg-[#111111] w-full h-[5px] top-0 left-0 z-10"></div>

            {avatarDisplay3}
            <div className="w-full mt-2">Steve</div>

            {character3Message && (
              <>
                <div className="bg-white/20 h-[1px] mx-0 my-2"></div>
                <div className="w-full text-opacity-80">
                  {" "}
                  {character3Message.content}
                </div>
              </>
            )}
            {steveLoad && <Loading/>}
          </div>}
        </div>
        <div className="w-fit mx-auto flex justify-center flex-col items-center gap-4 ">
          {!started && (
            <>
              Start discussion with the topic
              <div className="flex flex-row gap-2">
                {[
                  "Sam Altman got fired from OpenAI",
                  "Sam Altman is getting back to OpenAI",
                ].map((x) => (
                  <button
                    className="btn flex w-fit text-md justify-center"
                    key={x}
                    onClick={() => {
                      setTopic(x);
                      triggerNewChat();
                    }}
                  >
                    {x}
                  </button>
                ))}

                <button
                  className="btn"
                  onClick={() =>
                    (document.getElementById("my_modal_1") as any)?.showModal()
                  }
                >
                  Custom
                </button>
                <dialog id="my_modal_1" className="modal text-black">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg ">Custom Prompt</h3>
                    <input
                      id="custom_prompt_input"
                      type="text"
                      className="input w-full mt-2"
                      placeholder="Enter your text here"
                    />
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn">Close</button>
                      </form>
                      <button
                        className="btn"
                        onClick={() => {
                          const customPrompt = (
                            document.getElementById(
                              "custom_prompt_input",
                            ) as HTMLInputElement
                          ).value;
                          setTopic(customPrompt);
                          triggerNewChat();
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </dialog>
              </div>
            </>
          )}
          {started && (
            <>
              <button
                disabled={userLoad || assistantLoad}
                onClick={async () => {
                  setStarted(false);
                  start.current = false;
                  setAllMessage([]);
                  audioSourceNode1.current?.stop();
                  audioSourceNode2.current?.stop();
                  audioSourceNode2.current?.stop();

                  setCharacter1Message(undefined);
                  setCharacter2Message(undefined);
                  setCharacter3Message(undefined);

                  setTopic("");
                }}
                className="btn flex w-fit text-md justify-center"
              >
                {"Stop"}
              </button>
            </>
          )}
        </div>
      </div>
      {numberOfAgent == 2 && (
        <button
          className="btn absolute bottom-20 right-6"
          onClick={() => {
            setNumberOfAgent(3);
            toast("You've added a special guest!");
          }}
        >
          Add special guest
        </button>
      )}
    </main>
  );
}

export interface ChatGPTMessage {
  role: string;
  content: string;
}

const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

function ChatLine({
  role = "assistant",
  content,
  aiName,
}: ChatGPTMessage & {
  aiName: string;
}) {
  if (!content) {
    return null;
  }
  const formatteMessage = convertNewLines(content);

  if (role == "system") return <></>;

  return (
    <div
      className={
        role != "assistant" ? "float-right clear-both" : "float-left clear-both"
      }
    >
      <div
        className={`float-right mb-5 rounded-lg bg-white px-4 py-2 shadow-lg ring-1 ring-zinc-100 ${
          role != "assistant" ? "ml-24" : "mr-24"
        }`}
      >
        <div className="flex space-x-1">
          <div className="flex-1 gap-2">
            <p className="font-large text-xxl text-gray-900">
              <a href="#" className="hover:underline text-sm">
                {role == "assistant" ? aiName ?? "AI" : "Sam"}
              </a>
            </p>
            <p
              className={`text ${
                role == "assistant"
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              {formatteMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const LoadingChatLine = (props: { isUser: boolean }) => (
  <div
    className={
      props.isUser ? "float-right clear-both" : "float-left clear-both"
    }
  >
    <div
      className={`float-right mb-5 rounded-lg bg-white px-4 py-2 shadow-lg ring-1 ring-zinc-100 animate-pulse ${
        props.isUser ? "ml-8" : "mr-8"
      }`}
    >
      <div className="flex space-x-1">
        <div className="flex-1 gap-2">
          <p className="font-large text-xxl text-gray-900">
            <a href="#" className="hover:underline text-sm">
              {!props.isUser ? "Elon" : "Sam"}
            </a>
          </p>
          <p>
            <FaEllipsis size={32} color={"black"} />
          </p>
        </div>
      </div>
    </div>
  </div>
);

function getOpponentName(agentId: string, numberOfAgent: number) {
  const opponents = ['Elon Musk', 'Sam Altman', 'Steve Job'];
  const id = Math.floor(Math.random() * opponents.length)
  let opponent = '';
  if (numberOfAgent === 2) {
    opponent = agentId === '1' ? 'Sam Altman' : 'Elon Musk';
  } else if (numberOfAgent === 3) {
    while(agentId != id.toString()){
      opponent = opponents[Math.floor(Math.random() * opponents.length)];}
  }
  return opponent;
}