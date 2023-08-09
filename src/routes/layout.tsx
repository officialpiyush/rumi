import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="h-screen bg-black border-12 border-double overflow-hidden text-white flex flex-col justify-between gap-4 font-mono">
      <main class="flex-1 overflow-y-auto">
        <Slot />
      </main>

      <footer class="flex justify-end text-xs text-zinc-500 py-2">
        <Link class="underline" href="https://pycz.dev">
          <div>Piyush</div>
        </Link>
      </footer>
    </div>
  );
});
