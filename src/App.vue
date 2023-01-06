<template>
    <div class="holder">
        
        <router-view></router-view>

    </div>
</template>

<style>
    .holder {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        flex-direction: column;
    }
    
    #app {
        width: 100%;
        height: 100%;
    }
</style>