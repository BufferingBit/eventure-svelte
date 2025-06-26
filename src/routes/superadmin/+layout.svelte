<script lang="ts">
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 import CollegeSidebar from "$lib/components/college-sidebar.svelte";

 let { children } = $props();
</script>

<Sidebar.Provider >
 <CollegeSidebar />
 <main>
  <Sidebar.Trigger />
  {@render children?.()}
 </main>
</Sidebar.Provider>
