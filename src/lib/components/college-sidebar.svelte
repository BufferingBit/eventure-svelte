<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  let colleges: { id: string; name: string }[] = [];

  onMount(async () => {
    const { data, error } = await supabase
      .from("colleges")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch colleges:", error.message);
    } else {
      colleges = data;
    }
  });
</script>

<Sidebar.Root class="fixed top-16 left-0 bottom-0 w-64 border-r border-border/20 shadow-md z-40">
  <div class="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-blue-200/70 to-gray-50/50 dark:from-indigo-900/10 dark:via-blue-900/10 dark:to-gray-800/20" />

  <Sidebar.Content class="h-full overflow-y-auto relative">
    <div class="p-4 border-b border-border/20 backdrop-blur-sm">
      <h2 class="text-lg font-semibold text-foreground flex items-center gap-2">
        <span class="bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">Eventure</span>
      </h2>
    </div>

    <div class="p-4 backdrop-blur-sm">
      <Sidebar.Group>
        <Sidebar.GroupLabel class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Colleges
        </Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each colleges as college (college.id)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton class="group">
                  {#snippet child({ props })}
                    <a
                      href={`/superadmin/college/${college.id}`}
                      class="flex items-center px-3 py-2 text-sm font-medium transition-colors hover:bg-indigo-500/10 hover:text-foreground rounded-md group-[.active]:bg-indigo-500/20 group-[.active]:text-indigo-600 dark:group-[.active]:text-indigo-300"
                      {...props}
                    >
                      <span class="truncate">{college.name}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </div>
  </Sidebar.Content>
</Sidebar.Root>

