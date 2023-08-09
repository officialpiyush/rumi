import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return <></>;
});

export const head: DocumentHead = {
  title: "Welcome to SomeChat",
  meta: [
    {
      name: "description",
      content: "smol rooms for smol chats",
    },
  ],
};
