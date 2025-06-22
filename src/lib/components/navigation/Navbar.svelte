<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "$lib/components/ui/command";
  import { page } from "$app/stores";
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  
  // Icons (you can move these to separate component files)
  const SearchIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `;
  
  const MenuIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  `;
  
  const CloseIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `;

  let openSearch = false;
  let openMobileMenu = false;
  let searchQuery = "";
  let searchResults: {
    events: any[];
    clubs: any[];
    colleges: any[];
  } = {
    events: [],
    clubs: [],
    colleges: []
  };

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    
    const [{ data: events }, { data: clubs }, { data: colleges }] = await Promise.all([
      supabase.from('events').select('id, name, poster_url').ilike('name', `%${searchQuery}%`).limit(3),
      supabase.from('clubs').select('id, name, logo_url').ilike('name', `%${searchQuery}%`).limit(3),
      supabase.from('colleges').select('id, name, logo_url').ilike('name', `%${searchQuery}%`).limit(3)
    ]);

    searchResults = {
      events: events || [],
      clubs: clubs || [],
      colleges: colleges || []
    };
  }

  function navigateToResult(type: string, id: string) {
    goto(`/${type}/${id}`);
    openSearch = false;
    openMobileMenu = false;
    searchQuery = "";
  }
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
  <div class="container flex h-16 items-center justify-between px-4">
    <!-- Logo and Main Navigation -->
    <div class="flex items-center gap-8">
      <a href="/" class="flex items-center gap-2 group">
        <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 group-hover:from-secondary group-hover:to-primary">
          Eventure
        </span>
      </a>

      <nav class="hidden md:flex items-center gap-6">
        <a
          href="/events"
          class="text-sm font-medium transition-colors hover:text-primary relative
          {$page.url.pathname === '/events' ? 'text-primary' : 'text-muted-foreground'}"
        >
          Events
          {#if $page.url.pathname === '/events'}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
          {/if}
        </a>
        <a
          href="/clubs"
          class="text-sm font-medium transition-colors hover:text-primary relative
          {$page.url.pathname === '/clubs' ? 'text-primary' : 'text-muted-foreground'}"
        >
          Clubs
          {#if $page.url.pathname === '/clubs'}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
          {/if}
        </a>
        <a
          href="/colleges"
          class="text-sm font-medium transition-colors hover:text-primary relative
          {$page.url.pathname === '/colleges' ? 'text-primary' : 'text-muted-foreground'}"
        >
          Colleges
          {#if $page.url.pathname === '/colleges'}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
          {/if}
        </a>
        <a
          href="/about"
          class="text-sm font-medium transition-colors hover:text-primary relative
          {$page.url.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'}"
        >
          About
          {#if $page.url.pathname === '/about'}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></span>
          {/if}
        </a>
      </nav>
    </div>

    <!-- Search and Auth -->
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Button -->
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        onclick={() => openMobileMenu = !openMobileMenu}
        aria-label="Toggle menu"
      >
        {@html openMobileMenu ? CloseIcon : MenuIcon}
      </Button>

      <!-- Search Button (Mobile) -->
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        onclick={() => openSearch = true}
        aria-label="Search"
      >
        {@html SearchIcon}
      </Button>

      <!-- Search Bar (Desktop) -->
      <div class="relative hidden md:block">
        <div class="relative">
          <Input
            bind:value={searchQuery}
            placeholder="Search events, clubs, colleges..."
            class="w-[240px] lg:w-[320px] pl-8 pr-4 transition-all duration-300 focus:w-[280px] lg:focus:w-[360px]"
            onkeydown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {@html SearchIcon}
          </div>
        </div>
      </div>

      <!-- Auth Buttons -->
      {#if $page.data.session}
        <Button variant="outline" class="hidden md:flex" onclick={() => goto('/dashboard')}>
          Dashboard
        </Button>
      {:else}
        <div class="hidden md:flex gap-2">
          <Button variant="outline" onclick={() => goto('/auth/login')}>
            Login
          </Button>
          <Button onclick={() => goto('/auth/signup')}>
            Sign Up
          </Button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if openMobileMenu}
    <div transition:fade class="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
      <div class="container px-4 py-3 space-y-4">
        <div class="relative mb-4">
          <Input
            bind:value={searchQuery}
            placeholder="Search..."
            class="w-full pl-8"
            onkeydown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {@html SearchIcon}
          </div>
        </div>
        
        <nav class="flex flex-col gap-3">
          <a
            href="/events"
            class="px-3 py-2 rounded-md font-medium transition-colors
            {$page.url.pathname === '/events' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}"
            on:click={() => openMobileMenu = false}
          >
            Events
          </a>
          <a
            href="/clubs"
            class="px-3 py-2 rounded-md font-medium transition-colors
            {$page.url.pathname === '/clubs' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}"
            on:click={() => openMobileMenu = false}
          >
            Clubs
          </a>
          <a
            href="/colleges"
            class="px-3 py-2 rounded-md font-medium transition-colors
            {$page.url.pathname === '/colleges' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}"
            on:click={() => openMobileMenu = false}
          >
            Colleges
          </a>
          <a
            href="/about"
            class="px-3 py-2 rounded-md font-medium transition-colors
            {$page.url.pathname === '/about' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}"
            on:click={() => openMobileMenu = false}
          >
            About
          </a>
        </nav>
        
        <div class="pt-4 border-t">
          {#if $page.data.session}
            <Button class="w-full" onclick={() => { goto('/dashboard'); openMobileMenu = false; }}>
              Dashboard
            </Button>
          {:else}
            <div class="flex gap-2">
              <Button variant="outline" class="flex-1" onclick={() => { goto('/auth/login'); openMobileMenu = false; }}>
                Login
              </Button>
              <Button class="flex-1" onclick={() => { goto('/auth/signup'); openMobileMenu = false; }}>
                Sign Up
              </Button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Search Dialog -->
  <CommandDialog open={openSearch} onOpenChange={(val: boolean) => openSearch = val}>
    <Command>
      <CommandInput
        bind:value={searchQuery}
        placeholder="Search events, clubs, colleges..."
        on:keydown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <CommandList class="max-h-[60vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        
        {#if searchResults.events.length > 0}
          <CommandGroup heading="Events">
            {#each searchResults.events as event}
              <CommandItem
                value={`event-${event.id}`}
                onSelect={() => navigateToResult('events', event.id)}
                class="gap-3"
              >
                <div class="h-8 w-8 rounded-md overflow-hidden bg-muted">
                  {#if event.poster_url}
                    <img src={event.poster_url} alt={event.name} class="h-full w-full object-cover" />
                  {:else}
                    <div class="h-full w-full flex items-center justify-center bg-muted">
                      {@html SearchIcon}
                    </div>
                  {/if}
                </div>
                <span>{event.name}</span>
              </CommandItem>
            {/each}
          </CommandGroup>
        {/if}

        {#if searchResults.clubs.length > 0}
          <CommandGroup heading="Clubs">
            {#each searchResults.clubs as club}
              <CommandItem
                value={`club-${club.id}`}
                onSelect={() => navigateToResult('clubs', club.id)}
                class="gap-3"
              >
                <div class="h-8 w-8 rounded-md overflow-hidden bg-muted">
                  {#if club.logo_url}
                    <img src={club.logo_url} alt={club.name} class="h-full w-full object-cover" />
                  {:else}
                    <div class="h-full w-full flex items-center justify-center bg-muted">
                      {@html SearchIcon}
                    </div>
                  {/if}
                </div>
                <span>{club.name}</span>
              </CommandItem>
            {/each}
          </CommandGroup>
        {/if}

        {#if searchResults.colleges.length > 0}
          <CommandGroup heading="Colleges">
            {#each searchResults.colleges as college}
              <CommandItem
                value={`college-${college.id}`}
                onSelect={() => navigateToResult('colleges', college.id)}
                class="gap-3"
              >
                <div class="h-8 w-8 rounded-md overflow-hidden bg-muted">
                  {#if college.logo_url}
                    <img src={college.logo_url} alt={college.name} class="h-full w-full object-cover" />
                  {:else}
                    <div class="h-full w-full flex items-center justify-center bg-muted">
                      {@html SearchIcon}
                    </div>
                  {/if}
                </div>
                <span>{college.name}</span>
              </CommandItem>
            {/each}
          </CommandGroup>
        {/if}
      </CommandList>
    </Command>
  </CommandDialog>
</header>