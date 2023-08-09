import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="h-screen bg-black border-12 border-double overflow-hidden text-white flex flex-col justify-between gap-4 font-mono">
      <main class="flex-1 overflow-y-auto">
        <Slot />
      </main>

      <footer class="flex justify-center text-md text-zinc-500 pb-2 pt-1">
        Rumi~ with ❤️ by
        <Link class="underline pl-2" href="https://pycz.dev">
          Piyush
        </Link>
      </footer>
    </div>
  );
});
