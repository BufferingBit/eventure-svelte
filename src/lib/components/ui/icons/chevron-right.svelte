<!-- src/lib/components/ui/icons/chevron-right.svelte -->
<script lang="ts">
  export let size = "16";
  export let strokeWidth = "2";
  export let className = "";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <path d="m9 18 6-6-6-6" />
</svg>
