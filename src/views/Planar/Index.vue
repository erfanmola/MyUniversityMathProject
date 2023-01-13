<script setup>
    import Header from '../../sections/Header.vue';
    import Footer from '../../sections/Footer.vue';
    import { ref, onMounted, onUnmounted } from 'vue';
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
        [ 60,  40, 16 ],
        [ 150, 40, 16 ],
        [ 240, 40, 16 ],
        [ 60,  160, 16 ],
        [ 150, 160, 16 ],
        [ 240, 160, 16 ],
    ];

    let CompletePaths = ref([]);

    let CirclesPath = ref([]);
    let CirclesPathCalculated = ref([]);

    const CalculateValues = () => {

        CirclesPath.value = [];
        CirclesPathCalculated.value = [];

        AspectRatio = document.querySelector('#CanvasPlanar > svg').width.baseVal.value / 300;

        CirlcesData.forEach((data) => {

            const path = toPath({
                type: 'element',
                name: 'circle',
                attributes: {
                    cx: data[0],
                    cy: data[1],
                    r: data[2],
                },
            });

            CirclesPath.value.push(path);
            CirclesPathCalculated.value.push(SerializePath(ScalePath(ParsePath(path), AspectRatio)));

        });

    };

    onMounted(() => {

        draw = new SvgDrawing(document.getElementById('CanvasPlanar'), {
            penColor: '#555555',
            penWidth: 6,
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

                }

            });

        });

        if (Crosses) {
            
            ResetError("خط ها نباید از همدیگه رد بشن");

        }else{

            LinePaths.forEach((LinePath) => {

                for (let i = 0; i < 3; i ++) {

                    for (let j = 3; j < 6; j++) {

                        if (!(CompletePaths.value.includes(`${ i }${ j }`))) {

                            if ((intersect(LinePath, CirclesPathCalculated.value[i]).length > 0) && (intersect(LinePath, CirclesPathCalculated.value[j]).length > 0)) {

                                CompletePaths.value.push(`${ i }${ j }`);
                                draw.drawEnd();

                                if (CompletePaths.value.length === 9) {

                                    Utils.Toast("کلک می‌زنی ؟ (:");

                                }

                            }

                        }

                    }

                }

            });

        }

    };

    onUnmounted(() => {

        clearInterval(interval);

    });

    const ResetMap = () => {

        clearInterval(interval);

        draw.clear();
        ErrorOccured.value = false;

        CompletePaths.value = [];

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

            <p>توی یک شهر خیلی کوچک، سه تا خونه داریم و قصد داریم که به هر یک از این خونه‌ها آب و برق و گاز لوله‌کشی و سیم‌کشی کنیم، به‌طوریکه که هیچ یک از لوله‌ها و سیم‌ها از روی همدیگه عبور نکنند، در کادر زیر می‌تونید از هرکدوم از منابع یک لوله یا سیمی رو به سمت خونه مربوطه بکشید (برای تجربه ترسیم راحت‌تر، از دسکتاپ استفاده کنید)</p>
        </div>

        <div id="container-map-planar">

            <svg id="PlanarSVG" viewBox="0 0 300 200">

                <path v-for="(path, index) in CirclesPath" :d="path" style="fill: var(--planar-circle)"></path>

                <circle v-if="CompletePaths.includes('23')" cx="60" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 58.333;stroke: var(--planar-electricity);`"></circle>
                <circle v-if="CompletePaths.includes('13')" cx="60" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 91.666;stroke: var(--planar-fire);`"></circle>
                <circle v-if="CompletePaths.includes('03')" cx="60" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 25;stroke: var(--planar-water);`"></circle>

                <circle v-if="CompletePaths.includes('24')" cx="150" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 58.333;stroke: var(--planar-electricity);`"></circle>
                <circle v-if="CompletePaths.includes('14')" cx="150" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 91.666;stroke: var(--planar-fire);`"></circle>
                <circle v-if="CompletePaths.includes('04')" cx="150" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 25;stroke: var(--planar-water);`"></circle>

                <circle v-if="CompletePaths.includes('25')" cx="240" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 58.333;stroke: var(--planar-electricity);`"></circle>
                <circle v-if="CompletePaths.includes('15')" cx="240" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 91.666;stroke: var(--planar-fire);`"></circle>
                <circle v-if="CompletePaths.includes('05')" cx="240" cy="160" r="16" :style="`fill: transparent;stroke-dasharray: 33.3333, 66.6666;stroke-width: 2px;stroke-dashoffset: 25;stroke: var(--planar-water);`"></circle>

                <path style="fill:var(--planar-home);fill-opacity:1;fill-rule:nonzero;stroke:none" d="m67.572 158.961-.004-.004-6.527-6.527A1.456 1.456 0 0 0 60 152c-.394 0-.765.152-1.042.43l-6.524 6.523a1.477 1.477 0 0 0-.004 2.09c.262.262.61.41.977.43h.308v4.805c0 .949.774 1.722 1.723 1.722h2.555a.47.47 0 0 0 .469-.469v-3.765c0-.434.351-.785.785-.785h1.507c.434 0 .786.351.786.785v3.765c0 .258.21.47.468.47h2.555c.95 0 1.723-.774 1.723-1.723v-4.805h.242c.39 0 .762-.153 1.039-.43a1.477 1.477 0 0 0 .004-2.082zm-.664 1.418a.535.535 0 0 1-.379.156h-.71a.47.47 0 0 0-.47.469v5.273a.785.785 0 0 1-.785.786h-2.086v-3.297c0-.95-.773-1.723-1.722-1.723h-1.508c-.95 0-1.723.773-1.723 1.723v3.297H55.44a.785.785 0 0 1-.785-.786v-5.273a.47.47 0 0 0-.469-.469h-.722a.542.542 0 0 1-.367-.156.54.54 0 0 1 0-.758l6.527-6.527a.535.535 0 0 1 .758 0l6.523 6.527h.004a.54.54 0 0 1 0 .758zM157.572 158.961l-.004-.004-6.527-6.527A1.456 1.456 0 0 0 150 152c-.394 0-.765.152-1.042.43l-6.524 6.523a1.477 1.477 0 0 0-.004 2.09c.262.262.61.41.977.43h.308v4.805c0 .949.774 1.722 1.723 1.722h2.555a.47.47 0 0 0 .468-.469v-3.765c0-.434.352-.785.786-.785h1.507c.434 0 .786.351.786.785v3.765c0 .258.21.47.468.47h2.555c.95 0 1.723-.774 1.723-1.723v-4.805h.242c.39 0 .762-.153 1.039-.43a1.477 1.477 0 0 0 .004-2.082zm-.664 1.418a.535.535 0 0 1-.379.156h-.71a.47.47 0 0 0-.47.469v5.273a.785.785 0 0 1-.785.786h-2.086v-3.297c0-.95-.773-1.723-1.722-1.723h-1.508c-.95 0-1.723.773-1.723 1.723v3.297h-2.086a.785.785 0 0 1-.785-.786v-5.273a.47.47 0 0 0-.469-.469h-.722a.542.542 0 0 1-.367-.156.54.54 0 0 1 0-.758l6.527-6.527a.535.535 0 0 1 .758 0l6.523 6.527h.004a.54.54 0 0 1 0 .758zM247.572 158.961l-.004-.004-6.527-6.527A1.456 1.456 0 0 0 240 152c-.394 0-.765.152-1.042.43l-6.524 6.523a1.477 1.477 0 0 0-.004 2.09c.262.262.61.41.977.43h.308v4.805c0 .949.774 1.722 1.723 1.722h2.555a.47.47 0 0 0 .468-.469v-3.765c0-.434.352-.785.786-.785h1.507c.434 0 .786.351.786.785v3.765c0 .258.21.47.468.47h2.555c.95 0 1.723-.774 1.723-1.723v-4.805h.242c.39 0 .762-.153 1.039-.43a1.477 1.477 0 0 0 .004-2.082zm-.664 1.418a.535.535 0 0 1-.379.156h-.71a.47.47 0 0 0-.47.469v5.273a.785.785 0 0 1-.785.786h-2.086v-3.297c0-.95-.773-1.723-1.722-1.723h-1.508c-.95 0-1.723.773-1.723 1.723v3.297h-2.086a.785.785 0 0 1-.785-.786v-5.273a.47.47 0 0 0-.469-.469h-.722a.542.542 0 0 1-.367-.156.54.54 0 0 1 0-.758l6.527-6.527a.535.535 0 0 1 .758 0l6.523 6.527h.004a.54.54 0 0 1 0 .758zm0 0" />
                <path style="fill:var(--planar-fire);fill-opacity:1;fill-rule:nonzero;stroke:none" d="M5.84 7.86a.39.39 0 1 0-.137-.532.382.382 0 0 0 .137.531Zm0 0" transform="translate(139.864 30)"/>
                <path style="fill:var(--planar-fire);fill-opacity:1;fill-rule:nonzero;stroke:none" d="M15.36 5.43a.386.386 0 0 0-.41-.246.39.39 0 0 0-.345.332c-.164 1.168-.82 4.101-2.02 5.386a26.905 26.905 0 0 0-.456-3.543c-.277-1.394-.656-2.671-1.129-3.785C10.402 2.164 9.656 1 8.777.117a.39.39 0 0 0-.668.219c-.035.258-.097.687-.105.738-.3 1.762-.797 3.363-1.477 4.762a.392.392 0 0 0 .184.523c.195.098.43.016.523-.18.704-1.445 1.215-3.093 1.532-4.898 1.468 1.832 2.214 4.34 2.59 6.215.456 2.3.472 4.176.472 4.195 0 .293.324.485.582.344.953-.523 1.742-1.77 2.352-3.71.14-.454.254-.891.343-1.274.766 2.324 1.083 4.394.938 6.156-.14 1.746-.727 3.16-1.738 4.211a5.674 5.674 0 0 1-.97.8c.364-.84.454-2.113-.315-4.023a.399.399 0 0 0-.418-.242.398.398 0 0 0-.336.328 5.44 5.44 0 0 1-.407 1.34c-.125-1-.484-2.52-1.472-3.457a.399.399 0 0 0-.657.203c-.003.016-.293 1.367-.789 2.262-.097.18-.234.379-.379.594-.226.343-.464.695-.609 1.035-.277.648-.297 1.293-.058 1.914.117.308.304.594.539.844l-.204-.063a7.452 7.452 0 0 1-1.328-.61c-1.511-.89-2.527-2.277-2.859-3.913a5.917 5.917 0 0 1 .355-3.516c.282-.652.657-1.242.985-1.73a.395.395 0 0 0-.11-.547.39.39 0 0 0-.543.11c-.351.519-.746 1.148-1.054 1.855a6.762 6.762 0 0 0-.406 3.988c.382 1.855 1.53 3.43 3.234 4.43.46.27.957.496 1.473.675.59.203 1.261.305 1.957.305.496 0 .988-.05 1.472-.152 1.352-.285 2.551-.938 3.465-1.887 1.14-1.184 1.797-2.762 1.957-4.691.18-2.211-.312-4.852-1.469-7.84zM8.675 16.566c.117-.27.332-.593.539-.906.152-.226.297-.445.414-.652.3-.54.527-1.203.676-1.711.84 1.324.843 3.293.843 3.316a.397.397 0 0 0 .575.352c.445-.235.754-.75.96-1.262.282 1.207.133 2.152-.437 2.77-.34.37-.805.578-1.254.656a2.313 2.313 0 0 1-.77.004 2.363 2.363 0 0 1-.695-.254c-.418-.23-.746-.59-.898-.988-.164-.43-.149-.864.047-1.325Zm0 0" transform="translate(139.864 30)"/>
                <path style="fill:var(--planar-water);fill-opacity:1;fill-rule:nonzero;stroke:none" d="M11.855 1.926c-.57-.664-1.078-1.25-1.476-1.742-.02-.04-.059-.059-.074-.079a.49.49 0 0 0-.684.079c-.398.492-.906 1.078-1.476 1.742C5.648 4.82 2.184 8.832 2.184 12.184c0 2.156.87 4.105 2.289 5.527C5.895 19.109 7.843 20 10 20a7.795 7.795 0 0 0 5.527-2.29 7.795 7.795 0 0 0 2.29-5.526c0-3.352-3.465-7.364-5.962-10.258zm2.989 15.082A6.81 6.81 0 0 1 10 19.035c-1.895 0-3.598-.777-4.844-2.008a6.854 6.854 0 0 1-2.008-4.843c0-2.993 3.332-6.852 5.735-9.633.398-.477.777-.91 1.117-1.328.34.418.719.851 1.117 1.308 2.403 2.781 5.735 6.625 5.735 9.633 0 1.895-.778 3.598-2.008 4.844zm0 0" transform="translate(49.816 30.5)"/>
                <path style="fill:var(--planar-water);fill-opacity:1;fill-rule:nonzero;stroke:none" d="M10.04 16.555a4.217 4.217 0 0 1-2.993-1.23 4.215 4.215 0 0 1-1.23-2.99.47.47 0 0 0-.473-.476.47.47 0 0 0-.473.477c0 1.437.586 2.723 1.516 3.672a5.174 5.174 0 0 0 3.652 1.492.467.467 0 0 0 .473-.473.467.467 0 0 0-.473-.472zm0 0" transform="translate(49.816 30.5)"/>
                <path style="fill:var(--planar-electricity);fill-opacity:1;fill-rule:nonzero;stroke:none" d="M245.62 36.64a.431.431 0 0 0-.375-.226h-4.336l1.832-5.348v-.003a.442.442 0 0 0-.062-.387.44.44 0 0 0-.344-.176h-4.387a.44.44 0 0 0-.402.285c0 .004-.004.004-.004.008l-3.524 10.402v.004a.443.443 0 0 0 .043.352.405.405 0 0 0 .27.195.385.385 0 0 0 .094.012h3.351l-1.453 7.75a.416.416 0 0 0 .11.375.42.42 0 0 0 .66-.059l8.504-12.742c.09-.133.097-.3.023-.441zm-8.074 10.97 1.168-6.2a.437.437 0 0 0-.09-.351.433.433 0 0 0-.328-.157h-3.277l3.234-9.547h3.484l-1.828 5.352a.427.427 0 0 0 .403.566h4.136zm0 0"/>

            </svg>

            <div id="CanvasPlanar"></div>

        </div>

        <div id="story">
            <p>دقیقا مثل پل های کونیگسبرک، متوجه می‌شیم که غیرممکن هست که از هر منبع به هر خونه لوله‌کشی یا سیم‌کشی کنیم و در عین حال خطوط از روی همدیگه هم رد نشن، به‌نظر می‌رسه که یک‌سری از گراف‌ها می‌تونند یال هایی داشته باشند که از همدیگه عبور نکنند، ولی بعضی های دیگه از گراف‌ها نمی‌تونند، به گراف‌هایی که می‌تونند یال هایی داشته باشند که از هم عبور نکنند، گراف مسطح گفته می‌شه</p>
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
</style>