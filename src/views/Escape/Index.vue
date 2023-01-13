<script setup>
    import Header from '../../sections/Header.vue';
    import Footer from '../../sections/Footer.vue';
    import Utils from '../../utils/index.js';
    import { ref } from 'vue';

    let data = ref([]);

    const board = ref(null);

    let ActiveDrag = null;

    const GetDraggableDirection = (item) => {

        let matrix = [
            [ null, null, null, null ],
            [ null, null, null, null ],
            [ null, null, null, null ],
            [ null, null, null, null ],
        ];

        data.value.forEach((item, index) => {

            if (item[2] === 1) {

                matrix[item[0]][item[1]] = index;

            }else if (item[3]) {

                matrix[item[0]][item[1]] = index;
                matrix[item[0] + 1][item[1]] = index;

            }else{

                matrix[item[0]][item[1]] = index;
                matrix[item[0]][item[1] + 1] = index;

            }

        });

        if (item[2] === 1) {

            
            if ((item[1] + 1) in matrix[item[0]] && matrix[item[0]][item[1] + 1] === null ) {

                return "right";

            }

            if ((item[1] - 1) in matrix[item[0]] && matrix[item[0]][item[1] - 1] === null ) {

                return "left";

            }

            if ((item[0] + 1) in matrix && matrix[item[0] + 1][item[1]] === null ) {

                return "bottom";

            }

            if ((item[0] - 1) in matrix && matrix[item[0] - 1][item[1]] === null)  {

                return "top";

            }

        }else if (item[3]) {

            
            if ((item[0] + 2) in matrix && matrix[item[0] + 2][item[1]] === null ) {

                return "bottom";

            }

            if ((item[0] - 1) in matrix && matrix[item[0] - 1][item[1]] === null)  {

                return "top";

            }

        }else{

            if ((item[1] + 2) in matrix[item[0]] && matrix[item[0]][item[1] + 2] === null ) {

                return "right";

            }

            if ((item[1] - 1) in matrix[item[0]] && matrix[item[0]][item[1] - 1] === null ) {

                return "left";

            }

        }
        
        return null;

    };

    const ResetMap = () => {

        data.value = [
            [ 0, 0, 1, null,  "احتمال", "#F44336" ],
            [ 0, 1, 2, true,  "نظریه اعداد", "#E91E63" ],
            [ 0, 2, 2, false, "آنالیز عددی", "#9C27B0" ],
            [ 1, 0, 1, null,  "هندسه", "#2196F3" ],
            [ 2, 1, 1, null,  "گسسته", "#3F51B5" ],
            [ 1, 3, 2, true,  "ترکیبیات", "#2196F3" ],
            [ 2, 0, 1, null,  "من",     "#009688" ],
            [ 2, 2, 1, null,  "ماتریس‌ها", "#CDDC39" ],
            [ 3, 0, 1, null,  "جبر خطی", "#FFC107" ],
            [ 3, 1, 1, null,  "دیفرانسیل", "#FF5722" ],
            [ 3, 2, 2, false, "بهینه‌سازی خطی", "#795548" ],
        ];

    };

    ResetMap();

    const HandleTouchStartEvent = (e) => {
        
        if (e.target.tagName.toLowerCase() === 'li') {    
            
            ActiveDrag = e.target.getAttribute('index');

            document.body.addEventListener('touchmove', HandleTouchMove);
            document.body.addEventListener('touchend', HandleTouchEndEvent);

        }

    };

    const HandleMouseDownEvent = (e) => {

        if (e.target.tagName.toLowerCase() === 'li') {

            ActiveDrag = e.target.getAttribute('index');

            document.body.addEventListener('mousemove', HandleMouseMove);
            document.body.addEventListener('mouseup', HandleMouseUpEvent);

        }

    };

    const HandleTouchEndEvent = (e) => {
        
        Utils.EnableScroll();
        
        document.body.removeEventListener('touchmove', HandleTouchMove);

        HandleDragEvent(e.touches[0].clientX, e.touches[0].clientY, e.target.getAttribute('index'), parseInt(e.target.style.left), parseInt(e.target.style.top), e.target, true);
        
    };

    const HandleMouseUpEvent = (e) => {

        document.body.removeEventListener('mousemove', HandleMouseMove);

        HandleDragEvent(e.clientX, e.clientY, e.target.getAttribute('index'), parseInt(e.target.style.left), parseInt(e.target.style.top), e.target, true);

    };

    const HandleTouchMove = (e) => {

        Utils.DisableScroll();

        HandleDragEvent(e.touches[0].clientX, e.touches[0].clientY, e.target.getAttribute('index'), parseInt(e.target.style.left), parseInt(e.target.style.top), e.target);

        return false;

    };

    const HandleMouseMove = (e) => {

        HandleDragEvent(e.clientX, e.clientY, e.target.getAttribute('index'), parseInt(e.target.style.left), parseInt(e.target.style.top), e.target);

    };    

    const HandleDragEvent = (clientX, clientY, index, currentLeft, currentTop, target, finalize = false) => {

        if (!(isNaN(currentLeft) || isNaN(currentTop)) && parseInt(ActiveDrag) === parseInt(target.getAttribute('index'))) {

            const BoardBounding = board.value.getBoundingClientRect();

            const left = Math.max(Math.min(((clientX - BoardBounding.left - 12 - (target.offsetWidth / 2)) / (BoardBounding.width - 24) * 100), 75), 0);
            const top  = Math.max(Math.min(((clientY - BoardBounding.top - 12 - (target.offsetHeight / 2)) / (BoardBounding.height - 24) * 100), 75), 0);

            const MovableDirection = GetDraggableDirection(data.value[index]);

            if (MovableDirection === 'right') {

                target.style.left = `${ Math.max(Math.min(left, (data.value[index][1] + 1) * 25), data.value[index][1] * 25) }%`;

                if (parseInt(target.style.left) % 25 === 0 && currentLeft % 25 !== 0) {

                    finalize = true;

                }

            }else if (MovableDirection === 'left') {

                target.style.left = `${ Math.min(Math.max(left, (data.value[index][1] - 1) * 25), data.value[index][1] * 25) }%`;


                if (parseInt(target.style.left) % 25 === 0 && currentLeft % 25 !== 0) {

                    finalize = true;

                }

            }else if (MovableDirection === 'bottom') {

                target.style.top = `${ Math.max(Math.min(top, (data.value[index][0] + 1) * 25), data.value[index][0] * 25) }%`;


                if (parseInt(target.style.top) % 25 === 0 && currentTop % 25 !== 0) {

                    finalize = true;

                }

            }else if (MovableDirection === 'top') {

                target.style.top = `${ Math.min(Math.max(top, (data.value[index][0] - 1) * 25), data.value[index][0] * 25) }%`;

                if (parseInt(target.style.top) % 25 === 0 && currentTop % 25 !== 0) {

                    finalize = true;

                }

            }

            if (finalize) {

                if (MovableDirection === 'right') {

                    target.style.left = `${ (Math.abs(parseInt(target.style.left) - (data.value[index][1] * 25)) < Math.abs(parseInt(target.style.left) - ((data.value[index][1] + 1) * 25))) ? (data.value[index][1] * 25) : ((data.value[index][1] + 1) * 25) }%`;
                    data.value[index][1]++;

                }else if (MovableDirection === 'left') {

                    target.style.left = `${ (Math.abs(parseInt(target.style.left) - (data.value[index][1] * 25)) < Math.abs(parseInt(target.style.left) - ((data.value[index][1] - 1) * 25))) ? (data.value[index][1] * 25) : ((data.value[index][1] - 1) * 25) }%`;
                    data.value[index][1]--;

                }else if (MovableDirection === 'bottom') {

                    target.style.top = `${ (Math.abs(parseInt(target.style.top) - (data.value[index][0] * 25)) < Math.abs(parseInt(target.style.top) - ((data.value[index][0] + 1) * 25))) ? (data.value[index][0] * 25) : ((data.value[index][0] + 1) * 25) }%`;
                    data.value[index][0]++;

                }else if (MovableDirection === 'top') {

                    target.style.top = `${ (Math.abs(parseInt(target.style.top) - (data.value[index][0] * 25)) < Math.abs(parseInt(target.style.top) - ((data.value[index][0] - 1) * 25))) ? (data.value[index][0] * 25) : ((data.value[index][0] - 1) * 25) }%`;
                    data.value[index][0]--;

                }

                ActiveDrag = null;

                if (data.value[6][0] === 1 && data.value[6][1] === 3) {

                    Utils.Toast("بالاخره تونستی (:");

                }

            }

        }

    };
</script>

<template>
    <Header>
        <template #header>
            <li @click="ResetMap"><i class="icon-rotate-cw"></i></li>
        </template>
    </Header>
        
    <section id="container-escape" class="section">
        
        <div id="story">
            <h2>مسیر آزادی</h2>

            <p>اینجا محیط دانشگاه هست و "من" در بین انبوهی از مشکلات گیر افتادم، می‌تونید من رو از این محیط محصور که فقط یک راه خروج داره، نجات بدید ؟</p>
        </div>

        <div id="container-escape-card">
            
            <ul ref="board">
                <li v-for="(item, index) in data" @mousedown="HandleMouseDownEvent" @touchstart="HandleTouchStartEvent" :index="index"  :class="item[3] ? 'vertical' : ''" :style="`background: ${ item[5] };top: ${ item[0] * 25 }%;left: ${ item[1] * 25 }%;width: ${ item[3] ? '25%' : (item[3] === false ? '50%' : '25%') };height: ${ item[3] ? '50%' : (item[3] === false ? '25%' : '25%') };font-weight: ${ item[4] === 'من' ? 'bold' : 'normal' };`">
                    {{  item[4] }}
                </li>
            </ul>

        </div>
        
    </section>

    <Footer />
</template>

<style lang="scss">

    #container-escape {
        display: flex;
        flex-direction: column;
        padding: 24px  0;
        position: relative;
    }

    #container-escape-card {
        display: flex;
        padding: 24px  0;
        position: relative;
        justify-content: center;
        
        > ul {
            display: block;
            content: '';
            background-color: var(--bg-card);
            box-shadow: var(--shadow-card);
            border-radius: 12px;
            width: 100%;
            max-width: 512px;
            aspect-ratio: 1/1;
            border: 12px solid var(--bg-card);
            position: relative;
            box-shadow: 0px 0px 0px 6px var(--accent);

            &::after {
                content: '';
                height: 25%;
                width: 6px;
                background-color: var(--bg);
                position: absolute;
                top: 25%;
                right: -18px;
            }

            > li {
                position: absolute;
                width: 25%;
                border: 6px solid var(--bg-card);
                border-radius: 24px;
                overflow: hidden;
                cursor: move;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-shadow: 2px 2px rgba(0,0,0,0.25);
                line-height: 2;
                text-align: center;
                user-select: none;
            }
        }
    }

</style>