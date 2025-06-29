<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  export let collegeId: string;

  let clubs: { id: string; name: string }[] = [];
  let error: string | null = null;

  onMount(async () => {
    if (!collegeId || typeof collegeId !== 'string') {
      error = `Invalid collegeId: ${JSON.stringify(collegeId)}`;
      console.error(error);
      return;
    }

    console.log("Fetching clubs for college:", collegeId);

    const { data, error: supabaseError } = await supabase
      .from("clubs")
      .select("id, name")
      .eq("college_id", collegeId)
      .order("name", { ascending: true });

    if (supabaseError) {
      error = `Failed to fetch clubs: ${supabaseError.message}`;
      console.error(error);
    } else {
      clubs = data || [];
      console.log("Fetched clubs:", clubs);
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
          Clubs
        </Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each clubs as club (club.id)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton class="group">
                  {#snippet child({ props })}
                    <a
                      href={`/superadmin/college/${collegeId}/clubs/${club.id}`}
                      class="flex items-center px-3 py-2 text-sm font-medium transition-colors hover:bg-indigo-500/10 hover:text-foreground rounded-md group-[.active]:bg-indigo-500/20 group-[.active]:text-indigo-600 dark:group-[.active]:text-indigo-300"
                      {...props}
                    >
                      <span class="truncate">{club.name}</span>
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


