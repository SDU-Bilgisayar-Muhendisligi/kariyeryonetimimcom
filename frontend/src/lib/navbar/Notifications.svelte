<script>
    import { onMount } from 'svelte';
    import { scale } from 'svelte/transition';
    import { userStore } from '@/stores.js';
    import { goto } from '$app/navigation';
    import { env } from '$env/dynamic/public';
    import Icon from '@iconify/svelte';
    import { each } from 'svelte/internal';
    import Cookies from 'js-cookie';
    let show = false; // menu state
    let menu = null; // menu wrapper DOM reference

    let notifications = [];

    onMount(async () => {
        const handleOutsideClick = (event) => {
            if (show && !menu.contains(event.target)) {
                show = false;
            }
        };

        const handleEscape = (event) => {
            if (show && event.key === 'Escape') {
                show = false;
            }
        };

        if ($userStore.username) {
            let data = await fetch(`${env.PUBLIC_API_URL}/user/notification/${$userStore.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${Cookies.get('token')}`
                }
            }).then((res) => res.json());

            notifications = data.notifications;
        }

        // add events when element is added to the DOM
        document.addEventListener('click', handleOutsideClick, false);
        document.addEventListener('keyup', handleEscape, false);

        // remove events when element is removed from the DOM
        return () => {
            document.removeEventListener('click', handleOutsideClick, false);
            document.removeEventListener('keyup', handleEscape, false);
        };
    });
</script>

<div class="relative" bind:this={menu}>
    <div>
        <button
            on:click={() => (show = !show)}
            class="h-10 w-10 bg-gitcol-900 flex items-center justify-center text-xl rounded-full"
        >
            <Icon icon="mdi:bell-notification" color="white" />
        </button>

        {#if show}
            <div
                in:scale={{ duration: 200, start: 0.95 }}
                out:scale={{ duration: 175, start: 0.95 }}
                class="origin-top-right absolute right-0 w-64 h-80 overflow-y-auto mt-4 bg-gitcol-800 rounded-lg shadow-md border border-gitcol-600 z-50"
            >
                <div>
                    {#each notifications as notification}
                        <div>
                            <div class="flex items-center px-4 py-3 border-b border-gitcol-600">
                                <div class="flex-shrink-0">
                                    <img
                                        class="h-10 w-10 rounded-full"
                                        src={`${env.PUBLIC_API_URL}/file/${notification.profilePicture}`}
                                        alt=""
                                    />
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm leading-5 font-medium text-white">
                                        {notification.from}
                                        {notification.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>