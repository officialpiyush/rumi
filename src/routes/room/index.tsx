import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import Pusher from "pusher-js";
import PusherServer from "pusher";

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
  });

  return {
    pushed: true,
  };
});

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const sendMessageAction = useSendMessage();

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
      {location.url.searchParams.get("id")}

      <button
        onClick$={() =>
          navigate(`/room?id=${Math.random().toString(36).slice(2)}`)
        }
      >
        test
        {sendMessageAction.value && (
          <p>Result: {JSON.stringify(sendMessageAction.value)}</p>
        )}
      </button>

      <div class="w-full">
        <Form action={sendMessageAction} class="flex items-center gap-4">
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
