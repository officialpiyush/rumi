import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-6xl italic font-bold tracking-widest">Rumi~</h1>
      <h2 class="text-md text-zinc-700">smol rooms for smol chats</h2>

      <div class="py-4 flex flex-col gap-4 items-center">
        <input
          class="bg-black border-12 py-2 px-4 placeholder:(text-slate-600) border-double"
          type="text"
          placeholder="enter room name~"
        />

        <div class="flex items-center gap-2">
          <button>
            <div class="bg-black border-12 py-2 px-4 border-double border-blue hover:(border-black bg-blue text-black)">
              create room
            </div>
          </button>

          <button>
            <div class="bg-black border-12 py-2 px-4 border-double border-teal hover:(border-black bg-teal text-black)">
              join room
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Rumi~",
  meta: [
    {
      name: "description",
      content: "smol rooms for smol chats",
    },
  ],
};
