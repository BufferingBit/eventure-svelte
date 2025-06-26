<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  let colleges: { id: string; name: string }[] = [];

  onMount(async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch colleges:", error.message);
    } else {
      colleges = data;
    }
  });
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Colleges</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each clubs as club (club.id)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={`/clubs/${college.id}`} {...props}>
                    <span>{club.name}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>

