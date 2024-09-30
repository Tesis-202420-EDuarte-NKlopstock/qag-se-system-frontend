<script>
    import ChatBox from './components/ChatBox.svelte';
    import ConversationList from './components/ConversationList.svelte';
</script>

<div class="app">
    <ConversationList />
    <ChatBox />
</div>

<style>
    .app {
        display: flex;
        height: 100vh;
    }
</style>
