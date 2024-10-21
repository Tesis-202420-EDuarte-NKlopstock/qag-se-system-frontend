<script>
    import { onMount } from 'svelte';
    import ChatBox from '../components/chat/ChatBox.svelte';
    // import ConversationList from './components/chat/ConversationList.svelte';

    import { conversations, activeThreadId } from '../stores.js';
</script>

<div class="app">
    <!-- <ConversationList /> -->
    <ChatBox />
</div>

<style>
    .app {
        display: flex;
        height: 100vh;
    }
</style>
