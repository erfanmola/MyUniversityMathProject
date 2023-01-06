<script setup>
    import { ref } from 'vue';
    import Utils from '../utils';
    
    let ThemeMode = ref(window.localStorage.getItem('ThemeMode') ?? 'light');
    
    const SetThemeMode = (Mode, Notify = true) => {

        if (Mode === null) {

            ThemeMode.value = ThemeMode.value === 'light' ? 'dark' : 'light';

        }else{

            ThemeMode.value = Mode;

        }

        if (Notify) {

            window.localStorage.setItem('ThemeMode', ThemeMode.value);

            setTimeout(Utils.Toast(ThemeMode.value === 'light' ? 'برق اومد (:' : 'برق رفت (:'));

        }

        document.body.classList.remove('dark');
        document.body.classList.remove('light');
        document.body.classList.add(ThemeMode.value);
            
    };

    window.addEventListener("storage", (ev) => {

        if (ev.key === 'ThemeMode') {

            SetThemeMode(ev.newValue);

        }

    });

    SetThemeMode(ThemeMode.value, false);
</script>

<template>
    <header id="main-header">
        <routerLink to="/"><i class="icon-logo"></i><h1 class="no-select">پروژه دانشگاهی من (:</h1></routerLink>

        <ul id="widgets">
            <li @click="SetThemeMode(null)"><i :class="ThemeMode === 'light' ? 'icon-sun' : 'icon-moon'"></i></li>
            
            <slot name="header"></slot>
        </ul>
    </header>
</template>

<style lang="scss">

    #main-header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0;

        > a {
            transition: opacity .15s;
            display: flex;
            align-items: center;
            gap: 8px;
            
            &:hover {
                opacity: 0.75;
            }

            > h1 {
                font-size: 1.325rem;
            }

            > i {
                font-size: 2.5rem;
                color: var(--accent);
            }
        }

        > ul#widgets {
            display: flex;
            direction: ltr;
            gap: 16px;

            > li {
                cursor: pointer;
                font-size: 1.125rem;
            }

        }
    }

</style>