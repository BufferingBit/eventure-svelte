<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Define types if not already imported
  type College = {
    id: number;
    name: string;
    // Add other relevant fields based on your database schema
  };

  type Event = {
    id: number;
    name: string;
    description?: { text?: string };
    poster_url?: string;
    start_date: string;
    end_date: string;
    // Add other relevant fields as needed
  };

  type Club = {
    id: number;
    name: string;
    // Add other relevant fields based on your database schema
  };

  let events: Event[] = [];
  let colleges: College[] = [];
  let clubs: Club[] = [];
  let isLoading = true;

  // Utility function to format dates as e.g. "Apr 27, 2024"
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    isLoading = true;
    
    // Fetch events, colleges, clubs in parallel
    const [{ data: eventsData }, { data: collegesData }, { data: clubsData }] = await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('colleges').select('*').limit(6),
      supabase.from('clubs').select('*').limit(6)
    ]);

    events = eventsData || [];
    colleges = collegesData || [];
    clubs = clubsData || [];
    isLoading = false;
  }
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold text-center mb-12">Discover College Clubs & Events</h1>

  <!-- Events Section -->
  <section class="mb-16">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Featured Events</h2>
      <Button variant="link" onclick={() => goto('/events')}>View All</Button>
    </div>

    {#if isLoading}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each { length: 3 } as _}
          <Card>
            <CardContent class="h-[200px] animate-pulse bg-muted" />
          </Card>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each events as event}
          <Card class="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img 
                src={event.poster_url || '/placeholder-event.jpg'} 
                alt={event.name} 
                class="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent class="p-6">
              <CardTitle>{event.name}</CardTitle>
              <CardDescription class="mt-2 line-clamp-2">
                {event.description?.text || 'No description available'}
              </CardDescription>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-muted-foreground">
                  {formatDate(event.start_date)} - {formatDate(event.end_date)}
                </span>
                <Button size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Colleges & Clubs sections would follow similar patterns -->
</div>