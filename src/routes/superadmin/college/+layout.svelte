<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import CollegeSidebar from "$lib/components/college-sidebar.svelte";
  import ClubSidebar from "$lib/components/club-sidebar.svelte";
  import { page } from '$app/stores';

  const collegeId = $page.params.collegeId;
  const isClubsRoute = $page.url.pathname.includes('/clubs');
  const { children } = $props();
</script>

<Sidebar.Provider>
  {#if isClubsRoute && collegeId}
    <ClubSidebar {collegeId} />
  {:else}
    <CollegeSidebar />
  {/if}

  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
