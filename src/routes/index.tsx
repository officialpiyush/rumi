import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-6xl italic font-bold tracking-widest">Rumi~</h1>
      <h2 class="text-md text-zinc-700">smol rooms for smol chats</h2>
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
