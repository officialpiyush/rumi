import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import Pusher from "pusher-js";

const pusher = new Pusher(import.meta.env.PUBLIC_PUSHER_KEY, {
  cluster: import.meta.env.PUBLIC_PUSHER_CLUSTER,
});

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

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
  });

  return (
    <div>
      {location.url.searchParams.get("id")}

      <button
        onClick$={() =>
          navigate(`/room?id=${Math.random().toString(36).slice(2)}`)
        }
      >
        test
      </button>
    </div>
  );
});
