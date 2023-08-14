import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  Form,
  Link,
  routeAction$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { faker } from "@faker-js/faker";
import DomPurify from "dompurify";
import linkifyHtml from "linkify-html";
import { nanoid } from "nanoid";
import PusherServer from "pusher";
import Pusher from "pusher-js";
import { P, match } from "ts-pattern";

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

interface MessageData {
  id: string;
  message: string;
  username: string;
}

export const useSendMessage = routeAction$(async (data, requestEvent) => {
  const pusherServer = new PusherServer({
    cluster: import.meta.env.PUBLIC_PUSHER_CLUSTER,
    key: import.meta.env.PUBLIC_PUSHER_KEY,
    appId: requestEvent.env.get("PUSHER_APP_ID")!,
    secret: requestEvent.env.get("PUSHER_SECRET")!,
    useTLS: true,
  });

  const channelName = requestEvent.url.searchParams.get("id");
  if (!channelName) {
    return requestEvent.fail(400, {
      errorMessage: "no channel name",
    });
  }

  if (!data.message) {
    return requestEvent.fail(400, {
      errorMessage: "no message",
    });
  }

  await pusherServer.trigger(channelName, "message", {
    id: nanoid(),
    message: data.message,
    username: data.name,
  });

  return {
    pushed: true,
  };
});

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const sendMessageAction = useSendMessage();
  const userName = useSignal(faker.internet.userName());
  const messages = useSignal<MessageData[]>([]);

  const handleMessage = $((data: MessageData) => {
    data.message = DomPurify.sanitize(
      linkifyHtml(data.message, {
        target: "_blank",
        rel: "noopener noreferrer",
        className: "underline underline-double text-teal italic",
      })
    );

    messages.value = [...messages.value, data];
  });

  useVisibleTask$(async ({ track }) => {
    track(() => location.url.searchParams);

    const pusher = new Pusher(import.meta.env.PUBLIC_PUSHER_KEY, {
      cluster: import.meta.env.PUBLIC_PUSHER_CLUSTER,
    });

    const channelName = location.url.searchParams.get("id");
    if (!channelName) {
      navigate("/");
      return;
    }

    const subscribed = pusher.subscribe(channelName);
    subscribed.bind("message", handleMessage);

    return () => {
      subscribed.unbind("message", handleMessage);
      pusher.disconnect();
    };
  });

  return (
    <div class="h-full flex flex-col gap-4 justify-between px-24 py-12">
      <div class="flex items-center justify-between gap-8">
        <div class="flex items-center gap-2">
          <div class="font-bold underline underline-double">Room ID: </div>
          <span class="italic">{location.url.searchParams.get("id")}</span>
        </div>

        <Link
          href="/"
          class="text-teal italic underline flex items-center gap-1 text-lg"
        >
          <div class="i-material-symbols-arrow-back"></div>
          Home
        </Link>

        <div class="flex items-center gap-2">
          <div class="font-bold underline underline-double">UserName: </div>
          <span class="italic">{userName}</span>L
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-end h-full w-full border-12 border-double overflow-y-auto px-4 py-4">
        {match(messages)
          .with({ value: [] }, () => (
            <div class="text-lg text-zinc-5 lowercase"> start messaging! </div>
          ))
          .with({ value: P.select() }, (m) =>
            m.map((message) => (
              <div key={message.id} class="flex gap-2">
                <span class="font-bold underline underline-double italic">
                  {message.username}:
                </span>

                <p dangerouslySetInnerHTML={message.message}></p>
              </div>
            ))
          )
          .exhaustive()}
      </div>

      <div class="w-full">
        <Form action={sendMessageAction} class="flex items-center gap-4">
          <input
            class="hidden"
            type="text"
            name="name"
            value={userName.value}
          />
          <input
            name="message"
            class="flex-1 bg-black border-12 py-2 px-4 placeholder:(text-slate-600) border-double"
            type="text"
            placeholder="enter message~"
          />

          <button type="submit">
            <div class="bg-black border-12 py-2 px-4 border-double border-blue hover:(border-black bg-blue text-black)">
              send
            </div>
          </button>
        </Form>
      </div>
    </div>
  );
});
