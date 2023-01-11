<script setup>
    import Header from '../../sections/Header.vue';
    import Footer from '../../sections/Footer.vue';
    import { ref, onMounted, onUnmounted, watch } from 'vue';
    import { SvgDrawing } from '@svg-drawing/core';
    import ParsePath from 'parse-svg-path';
    import ScalePath from 'scale-svg-path';
    import SerializePath from 'serialize-svg-path';
    import intersect from 'path-intersection';
    import toPath from 'element-to-path';
    import Utils from '../../utils';

    const TickRate = 150;

    const ErrorOccured = ref(false);

    let draw, interval, AspectRatio;

    const CalculateValues = () => {

        AspectRatio = document.querySelector('#CanvasPlanar > svg').width.baseVal.value / 640;

    };

    onMounted(() => {

        draw = new SvgDrawing(document.getElementById('CanvasPlanar'), {
            penColor: '#555555',
            penWidth: 10,
            curve: true,
            close: false,
            delay: 20,
            fill: 'none',
            background: undefined,
        });

        draw.clear();

        setTimeout(() => {

            CalculateValues();

            interval = setInterval(HandleCycle, TickRate);

        });

    });

    window.onresize = CalculateValues;

    const HandleCycle = () => {

        document.querySelectorAll('#CanvasPlanar > svg > path').forEach((line, index) => {

            const LinePath = line.getAttribute('d') ?? null;

            if (LinePath) {

            }

        });

    };

    onUnmounted(() => {

        clearInterval(interval);

    });

    const ResetMap = () => {

        clearInterval(interval);

        draw.clear();
        ErrorOccured.value = false;

        setTimeout(() => {
        
            interval = setInterval(HandleCycle, TickRate);

        }, TickRate);

    };
</script>

<template>
    <Header>
        <template #header>
            <li @click="ResetMap"><i class="icon-rotate-cw"></i></li>
        </template>
    </Header>
        
    <section id="container-planar" class="section">
        
        <div id="story">
            <h2>لوله‌کشی خانه‌ها</h2>

            <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>

        </div>

        <div id="container-map-planar">

            <svg :id="ActiveMap" viewBox="0 0 640 400">

            </svg>

            <div id="CanvasPlanar"></div>

        </div>

    </section>

    <Footer />
</template>

<style lang="scss">

    #container-planar {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    #container-map-planar {
        position: relative;
        background: var(--bg-card);
        box-shadow: var(--shadow-card);
        border-radius: 12px;

        > div {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 10;

            > svg {
            
            }
        }

    }
</style>