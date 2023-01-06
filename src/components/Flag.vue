<script lang="ts" setup>
    const props = defineProps({
        language: { type: String }
    });
</script>

<template>

    <span v-if="language === 'fa'" :title="t('general.language_switch')" class="icon-iran"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
    
    <span v-else-if="language === 'en'" :title="t('general.language_switch')" class="icon-uk"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span></span>

</template>