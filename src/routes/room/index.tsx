import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import Pusher from "pusher-js";
import PusherServer from "pusher";
import { faker } from "@faker-js/faker";

const pusher = new Pusher(import.meta.env.PUBLIC_PUSHER_KEY, {
  cluster: import.meta.env.PUBLIC_PUSHER_CLUSTER,
});

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

  pusherServer.trigger(channelName, "message", {
    message: data.message,
    user: data.name,
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

  const handleMessage = $((message: string) => {
    console.log(message);
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.searchParams);

    const channelName = location.url.searchParams.get("id");
    if (!channelName) {
      navigate("/");
      return;
    }

    const subscribed = pusher.subscribe(channelName);
    subscribed.bind("message", handleMessage);

    return () => {
      subscribed.unbind("message", handleMessage);
      pusher.unsubscribe(channelName);
    };
  });

  return (
    <div class="h-full flex flex-col gap-4 justify-between px-24 py-12">
      <div class="flex items-center justify-between gap-8">
        <div class="flex items-center gap-2">
          <div class="font-bold underline underline-double">Room ID: </div>
          <span class="italic">{location.url.searchParams.get("id")}</span>
        </div>

        <div class="flex items-center gap-2">
          <div class="font-bold underline underline-double">UserName: </div>
          <span class="italic">{userName}</span>
        </div>
      </div>

      <div class="flex-1 h-full w-full bg-pink overflow-y-auto">.</div>

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
