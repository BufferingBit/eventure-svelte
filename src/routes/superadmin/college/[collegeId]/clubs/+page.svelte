<script>
  import { page } from '$app/stores';
  $: collegeId = $page.url.searchParams.get('collegeId');
  console.log(collegeId);

</script>
