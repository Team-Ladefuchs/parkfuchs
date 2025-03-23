import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getEnabledInboxCities } from "~/db/city";
import { formatLink } from "~/functions/utils";

export const useCities = routeLoader$(async (_requestEvent) => {
  return await getEnabledInboxCities();
});

export default component$(() => {
  const search = useSignal("");
  const opeItem = useSignal<string | null>(null);

  const isSelected = (id: string) => {
    return opeItem.value === id;
  };

  const items = useCities();

  return (
    <div class="max-w-lg mx-auto grid gap-y-4">
      <section>
        <input
          bind:value={search}
          type="text"
          class="border-2 border-slate-300 rounded-lg w-full py-2 px-2 text-xl bg-neutral-200"
        />
      </section>
      <section class="flex flex-col divide-y-2">
        {items.value
          .filter(({ cityRef }) =>
            cityRef.name
              .toLocaleLowerCase()
              .includes(search.value.toLocaleLowerCase())
          )
          .map((item) => (
            <div
              key={item.id}
              class=" bg-slate-300 first:rounded-t-md last:rounded-b-md accordion-item-wrapper w-full"
            >
              <header
                class={[
                  "cursor-pointer p-2",
                  isSelected(item.id) ? "bg-green-600/80" : "",
                ]}
                onClick$={() =>
                  (opeItem.value = opeItem.value === item.id ? null : item.id)
                }
              >
                <p class="text-black card-title">{item.cityRef.name}</p>
                <p class="text-neutral-500">{item.cityRef.state}</p>
              </header>

              <section
                class={[
                  "accordion-content",
                  isSelected(item.id) ? "accordion-content-open" : "",
                ]}
              >
                <div class="accordion-body">
                  <div class="h-32 px-3 py-4">
                    <div>Content</div>
                    {item.websiteExtras?.length > 0 &&
                      item.websiteExtras
                        .filter((x) => x.url)
                        .map((link) => (
                          <a key={link.url} href={link.url}>
                            {formatLink(link.url ?? "")}
                          </a>
                        ))}
                  </div>
                </div>
              </section>
            </div>
          ))}
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
