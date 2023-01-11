<script setup>
    import Header from '../../sections/Header.vue';
    import Footer from '../../sections/Footer.vue';
    import { ref, onMounted, onUnmounted, watch } from 'vue';
    import { Path, SvgDrawing } from '@svg-drawing/core';
    import ParsePath from 'parse-svg-path';
    import ScalePath from 'scale-svg-path';
    import SerializePath from 'serialize-svg-path';
    import intersect from 'path-intersection';
    import toPath from 'element-to-path';
    import Utils from '../../utils';

    const TickRate = 150;

    const ErrorOccured = ref(false);

    let draw, interval, AspectRatio;

    let CirlcesData = [
        [ 18, 12, 4, "red" ],
        [ 42, 12, 4, "green" ],
        [ 66, 12, 4, "blue" ],
        [ 18, 45, 4, "orange" ],
        [ 42, 45, 4, "salmon" ],
        [ 66, 45, 4, "purple" ],
    ];

    let CompletePaths = ref([]);

    let CirclesPath = ref([]);

    const CalculateValues = () => {

        AspectRatio = document.querySelector('#CanvasPlanar > svg').width.baseVal.value / 300;

        CirclesPath.value = CirlcesData.map((data) => {

            return SerializePath(ScalePath(ParsePath(toPath({
                type: 'element',
                name: 'circle',
                attributes: {
                    cx: data[0],
                    cy: data[1],
                    r: data[2],
                },
            })), AspectRatio));

        });

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

        let LinePaths = [];

        const Paths = document.querySelectorAll('#CanvasPlanar > svg > path');

        Paths.forEach((line, index) => {

            const LinePath = line.getAttribute('d') ?? null;

            if (LinePath) {

                LinePaths.push(LinePath);

            }

        });

        let Crosses = false;

        LinePaths.forEach((Path1, Path1Key) => {

            LinePaths.forEach((Path2, Path2Key) => {

                if (!(Crosses) && Path1 !== Path2 && intersect(Path1, Path2).length > 0) {

                    draw.drawEnd();

                    Crosses = true;

                    Paths[Path1Key].classList.add('crossed-line-b');
                    Paths[Path2Key].classList.add('crossed-line-a');

                }

            });

        });

        if (Crosses) {
            
            ResetError("خط ها نباید از همدیگه رد بشن");

        }else{

            // TODO: Go On

        }

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

    const ResetError = (reason = "خطا") => {

        clearInterval(interval);

        Utils.Toast(reason);

        setTimeout(ResetMap, 1500);

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

            <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و</p>
        </div>

        <div id="container-map-planar">

            <svg id="PlanarSVG" viewBox="0 0 300 200">

                <path v-for="(path, index) in CirclesPath" :d="path" :style="`fill: ${ CirlcesData[index][3] }`"></path>

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

    #CanvasPlanar svg path {
        stroke: var(--draw-color);
    }

    .crossed-line-a {
        stroke: red !important;
    }

    .crossed-line-b {
        stroke: blue !important;
    }
</style>