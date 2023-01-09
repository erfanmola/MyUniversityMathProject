<script setup>
    import Header from '../../sections/Header.vue';
    import Footer from '../../sections/Footer.vue';
    import { ref, onMounted, onUnmounted } from 'vue';
    import { SvgDrawing } from '@svg-drawing/core';
    
    const VisualizeCanvas = true;

    const EnteredBridge = ref(false);

    const ErrorOccured = ref(false);

    const ActiveMap = ref('Map1');

    const BridgePaths = {
        'Map1': [
            [ 200, 56  , 30, 60, true,  '' ],
            [ 215, 226 , 30, 60, true,  '' ],
            [ 290, 225 , 30, 60, true,  '' ],
            [ 456, 59  , 30, 60, true,  '' ],
            [ 395, 160 , 60, 30, false, '' ],
            [ 300, 61  , 30, 60, true,  '' ],
            [ 450, 300 , 30, 60, true,  '' ],
        ],
    };

    const WaterPaths = {
        'Map1': "M521,106l64-7l55,0.7V66.1L576,61l-58,10h-87l-86,6l-80-9l-98,3l-19,15v62v49l-14,51l-66,4l-68-6.9V284h37 l61-1l68,1l64-6l62-6l57,1l21,1l11,17l18,32l40,28l45,6h45l48-15l41-19l22-6.4v-41.2l-26,7.7l-47,25l-51,15l-56-5l-33-28v-46l10-37 l9-46l-1-40l10-12L521,106z M414,147l-10,41l-5,38l-12,14h-26l-40-3h-50l-43,1l-47,8l-4-15l8-37l-1-47l1-33l18-12l54-2l53,6l50,1 l37-3l18,10L414,147z"
    };

    let ValidBridges = ref([]);

    let draw, interval, canvas;

    const SVGToImageSrc = (svg) => {

        return 'data:image/svg+xml;base64,' + window.btoa(new XMLSerializer().serializeToString(svg));

    };

    onMounted(() => {

        canvas = document.getElementById('myCanvas');

        draw = new SvgDrawing(document.getElementById('Canvas'), {
            penColor: '#454545',
            penWidth: 10,
            curve: true,
            close: false,
            delay: 20,
            fill: 'none',
            background: undefined,
        });

        draw.clear();

        setTimeout(() => {

            interval = setInterval(HandleCycle, 250);

        });

    });

    const HandleCycle = () => {

        const ctx = canvas.getContext("2d");
        
        if (VisualizeCanvas) {
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }

        const AspectRatio = document.querySelector('#Canvas > svg').width.baseVal.value / 640;

        ctx.canvas.width  = document.querySelector('#Canvas > svg').width.baseVal.value;
        ctx.canvas.height = document.querySelector('#Canvas > svg').height.baseVal.value;

        if (VisualizeCanvas) {

            const MapImage = new Image();
            MapImage.src = SVGToImageSrc(document.getElementById(`${ ActiveMap.value }Bridges`));

            MapImage.onload = () => {

                ctx.drawImage(MapImage, 0, 0);

                const path = new Path2D(WaterPaths[ActiveMap.value]);
                ctx.fillStyle = '#00ffff';
                ctx.fill(path);

            };

        }

        document.querySelectorAll('#Canvas svg path').forEach((element, index) => {
            
            if (element.getAttribute('d')) {

                const path = new Path2D(element.getAttribute('d'));
                
                if (VisualizeCanvas) {

                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 8;
                    ctx.stroke(path);

                }

                BridgePaths[ActiveMap.value].forEach((Bridge, BridgeIndex) => {
                    
                    if (!(ValidBridges.value.includes(BridgeIndex))) {

                        let status = [false, false];

                        if (Bridge[4]) {

                            for (let i = Math.round(Bridge[0] * AspectRatio); i <= Math.round((Bridge[0] + Bridge[2]) * AspectRatio); i++) {

                                if (ctx.isPointInStroke(path, i, Math.round(Bridge[1] * AspectRatio))) {

                                    status[0] = true;

                                }else if (ctx.isPointInStroke(path, i, Math.round((Bridge[1] + Bridge[3]) * AspectRatio))) {

                                    status[1] = true;

                                }

                            }

                        }else{

                            for (let i = Math.round(Bridge[1] * AspectRatio); i <= Math.round((Bridge[1] + Bridge[3]) * AspectRatio); i++) {

                                if (ctx.isPointInStroke(path, Math.round(Bridge[0] * AspectRatio), i)) {

                                    status[0] = true;

                                }else if (ctx.isPointInStroke(path, Math.round((Bridge[0] + Bridge[2]) * AspectRatio), i)) {

                                    status[1] = true;

                                }

                            }

                        }

                        if (status[0] && status[1]) {

                            if (!(ValidBridges.value.includes(BridgeIndex))) {

                                ValidBridges.value.push(BridgeIndex);

                            }

                        }

                    }

                });

            }

        });

    };

    onUnmounted(() => { clearInterval(interval); });

    const ResetMap = () => {

        draw.clear();
        ValidBridges.value = [];
        ErrorOccured.value = false;
        EnteredBridge.value = false;

    };
</script>

<template>
    <Header>
        <template #header>
            <li @click="ResetMap"><i class="icon-rotate-cw"></i></li>
        </template>
    </Header>
    
    <section id="container-bridges" class="section">
        
        <div id="story">
            <h2>پل‌های کونیگسبرگ</h2>

            <p>
                در رنگ‌آمیزی نقشه‌ها یا هر طرح دیگری که از بخش های متمایز تشکیل شده باشد، برای تمایز بهتر بین بخش‌ها باید هیچ یک از همسایه های بخش با خود بخش رنگ یکسان نداشته باشند، همچنین باید سعی کنیم از کم‌ترین تعداد رنگ ممکن برای رنگ‌آمیزی استفاده کنیم که مخاطب را گمراه نکند، مثلا یک صفحه شطرنجی در حالت ایده‌آل می‌تواند فقط با دو رنگ سیاه و سفید رنگ‌آمیزی شود به‌طوریکه هیچ بخشی با همسایه های خود رنگ یکسان نداشته باشد،‌ شما نیز می‌توانید در کادر زیر نقشه ایران را با قاعده های مذکور رنگ‌آمیزی کنید.
            </p>
        </div>

        {{  ValidBridges }}

        <div id="container-map-bridges">

            <svg id="Map1" viewBox="0 0 640 400" class="map drawing-pointer noselect" style="touch-action: none;">
                <path class="water" d="M521,106l64-7l55,0.7V66.1L576,61l-58,10h-87l-86,6l-80-9l-98,3l-19,15v62v49l-14,51l-66,4l-68-6.9V284h37
                l61-1l68,1l64-6l62-6l57,1l21,1l11,17l18,32l40,28l45,6h45l48-15l41-19l22-6.4v-41.2l-26,7.7l-47,25l-51,15l-56-5l-33-28v-46l10-37
                l9-46l-1-40l10-12L521,106z M414,147l-10,41l-5,38l-12,14h-26l-40-3h-50l-43,1l-47,8l-4-15l8-37l-1-47l1-33l18-12l54-2l53,6l50,1
                l37-3l18,10L414,147z"></path>
                <rect x="244" y="111" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 7.1404 -13.6394)" class="house" width="40" height="37"></rect>
                <rect x="247.3" y="195.8" transform="matrix(0.9998 -1.745241e-02 1.745241e-02 0.9998 -3.6299 4.5828)" class="house" width="27" height="29"></rect>
                <rect x="191.5" y="156.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -5.8436 7.2585)" class="house" width="27" height="29"></rect>
                <rect x="335.2" y="194.1" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 11.4085 -18.4091)" class="house" width="44" height="29"></rect>
                <rect x="343.6" y="118.1" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -4.4883 12.9978)" class="house" width="53" height="34"></rect>
                <rect x="440.4" y="213.9" transform="matrix(0.9659 0.2588 -0.2588 0.9659 76.8615 -109.0127)" class="house" width="24" height="47"></rect>
                <rect x="335.8" y="42.6" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -2.9116 25.891)" class="house" width="67" height="24"></rect>
                <rect x="227.7" y="31.3" transform="matrix(0.9986 -5.233596e-02 5.233596e-02 0.9986 -2.065 12.6883)" class="house" width="27" height="29"></rect>
                <rect x="267.2" y="30.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 2.7496 -14.63)" class="house" width="27" height="29"></rect>
                <rect x="416" y="33" class="house" width="27" height="29"></rect>
                <rect x="487.5" y="30.5" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 1.8743 -17.4568)" class="house" width="27" height="29"></rect>
                <rect x="488.7" y="280.1" transform="matrix(0.9962 8.715574e-02 -8.715574e-02 0.9962 27.5889 -42.6472)" class="house" width="27" height="29"></rect>
                <rect x="530.2" y="271.4" transform="matrix(0.9563 -0.2924 0.2924 0.9563 -59.8354 171.4454)" class="house" width="27" height="29"></rect>
                <rect x="568.1" y="255.5" transform="matrix(0.9397 -0.342 0.342 0.9397 -57.2708 215.2178)" class="house" width="27" height="29"></rect>
                <rect x="501.1" y="114.1" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -7.8605 37.1244)" class="house" width="53" height="34"></rect>
                <rect x="188.7" y="215.8" transform="matrix(0.9925 0.1219 -0.1219 0.9925 28.9855 -22.2305)" class="house" width="15" height="20"></rect>
                <rect x="528.5" y="29.6" transform="matrix(0.9744 -0.225 0.225 0.9744 3.976 123.0592)" class="house" width="27" height="29"></rect>
                <rect x="151.7" y="34.9" transform="matrix(0.9781 -0.2079 0.2079 0.9781 -6.6555 35.4301)" class="house" width="27" height="29"></rect>
                <rect x="522.7" y="230.1" transform="matrix(0.9962 8.715574e-02 -8.715574e-02 0.9962 23.3605 -45.8007)" class="house" width="27" height="29"></rect>
                <rect x="542" y="190" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -12.9137 39.2464)" class="house" width="27" height="29"></rect>
                <rect x="555.6" y="159.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 6.2903 -19.9852)" class="house" width="40" height="21"></rect>
                <rect x="583.9" y="192.3" transform="matrix(0.9962 8.715574e-02 -8.715574e-02 0.9962 21.0971 -51.506)" class="house" width="33" height="47"></rect>
                <rect x="325.8" y="282.9" transform="matrix(0.9903 0.1392 -0.1392 0.9903 44.7774 -45.5055)" class="house" width="44" height="29"></rect>
                <rect x="251.4" y="282.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -29.5946 29.321)" class="house" width="27" height="29"></rect>
                <rect x="568.5" y="22.5" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 1.6445 -20.2885)" class="house" width="27" height="29"></rect>
                <rect x="336.4" y="6.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -0.2791 36.694)" class="house" width="27" height="29"></rect>
                <rect x="374.6" y="8.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 0.9102 -13.7604)" class="house" width="40" height="21"></rect>
                <rect x="605" y="248.9" transform="matrix(0.9781 -0.2079 0.2079 0.9781 -40.5754 134.2866)" class="house" width="27" height="22.4"></rect>
                <rect x="568" y="111" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -7.3396 40.8677)" class="house" width="27" height="29"></rect>
                <rect x="605.2" y="108.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 7.295 -32.2126)" class="house" width="27" height="29"></rect>
                <rect x="605.4" y="150.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -13.8576 65.601)" class="house" width="27" height="29"></rect>
                <rect x="476.7" y="5.8" transform="matrix(0.9994 3.489964e-02 -3.489964e-02 0.9994 0.7921 -17.4474)" class="house" width="46.9" height="16.3"></rect>
                <rect x="550.4" y="4.4" transform="matrix(0.9925 0.1219 -0.1219 0.9925 5.5736 -67.9025)" class="house" width="15" height="14.4"></rect>
                <rect x="605.7" y="26.1" transform="matrix(0.9962 8.715574e-02 -8.715574e-02 0.9962 5.8966 -53.8109)" class="house" width="27" height="29"></rect>
                <rect x="241.7" y="5.8" transform="matrix(0.9994 3.489964e-02 -3.489964e-02 0.9994 0.649 -9.246)" class="house" width="46.9" height="16.3"></rect>
                <rect x="565.8" y="352.7" transform="matrix(0.9335 -0.3585 0.3585 0.9335 -93.1501 232.0966)" class="house" width="27" height="29"></rect>
                <rect x="602.6" y="337.2" transform="matrix(0.9135 -0.4069 0.4069 0.9135 -89.8065 281.0948)" class="house" width="27" height="29"></rect>
                <rect x="614.4" y="375.4" transform="matrix(0.9925 0.1219 -0.1219 0.9925 51.2642 -72.9368)" class="house" width="15" height="14.4"></rect>
                <rect x="515.6" y="367.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 13.525 -18.4625)" class="house" width="40" height="21"></rect>
                <rect x="377.1" y="354.1" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -24.9041 29.0592)" class="house" width="53" height="34"></rect>
                <rect x="450.7" y="366.8" transform="matrix(0.9994 3.489964e-02 -3.489964e-02 0.9994 13.3751 -16.3201)" class="house" width="46.9" height="16.3"></rect>
                <rect x="256.8" y="366.6" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -25.7051 21.1695)" class="house" width="67" height="24"></rect>
                <rect x="337" y="357" class="house" width="27" height="29"></rect>
                <rect x="170.4" y="360.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -38.1915 21.2815)" class="house" width="27" height="29"></rect>
                <rect x="208.6" y="362.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 13.1635 -7.7514)" class="house" width="40" height="21"></rect>
                <rect x="137.6" y="330.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 12.0034 -5.2931)" class="house" width="40" height="21"></rect>
                <rect x="135" y="292" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -21.0203 11.104)" class="house" width="27" height="29"></rect>
                <rect x="176.2" y="293.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 16.3893 -9.507)" class="house" width="27" height="29"></rect>
                <rect x="128.3" y="362.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -13.0712 5.1784)" class="house" width="27" height="29"></rect>
                <rect x="257.4" y="324.5" transform="matrix(0.998 6.274802e-02 -6.274802e-02 0.998 21.8061 -16.333)" class="house" width="27" height="29"></rect>
                <rect x="59" y="295" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -21.4147 5.8098)" class="house" width="27" height="29"></rect>
                <rect x="96.2" y="292.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 16.2273 -5.3215)" class="house" width="27" height="29"></rect>
                <rect x="4.8" y="303.9" transform="matrix(-1.542559e-02 0.9999 -0.9999 -1.542559e-02 345.5636 296.5678)" class="house" width="44" height="29"></rect>
                <rect x="77.6" y="371.7" transform="matrix(0.9994 -3.566528e-02 3.566528e-02 0.9994 -13.5689 3.7248)" class="house" width="40" height="21"></rect>
                <rect x="14.1" y="353.1" transform="matrix(0.9949 0.1009 -0.1009 0.9949 37.5613 -2.2099)" class="house" width="53" height="34"></rect>
                <rect x="21.5" y="212.3" transform="matrix(0.9988 4.816983e-02 -4.816983e-02 0.9988 10.9645 -1.4229)" class="house" width="27" height="29"></rect>
                <rect x="62.6" y="210.2" transform="matrix(1 -4.171384e-03 4.171384e-03 1 -0.9365 0.3195)" class="house" width="27" height="29"></rect>
                <rect x="100.7" y="216.6" transform="matrix(0.9908 0.135 -0.135 0.9908 31.8173 -13.3302)" class="house" width="27" height="22.4"></rect>
                <rect x="109" y="136.7" transform="matrix(-9.854098e-02 -0.9951 0.9951 -9.854098e-02 -15.8615 288.0402)" class="house" width="27" height="29"></rect>
                <rect x="107.1" y="96.2" transform="matrix(0.1624 -0.9867 0.9867 0.1624 -8.1931 211.6737)" class="house" width="27" height="29"></rect>
                <rect x="115.5" y="59.7" transform="matrix(0.2138 -0.9769 0.9769 0.2138 28.8728 184.3482)" class="house" width="27" height="29"></rect>
                <rect x="22.8" y="176.6" transform="matrix(0.9998 -1.806533e-02 1.806533e-02 0.9998 -3.3986 1.0471)" class="house" width="67" height="24"></rect>
                <rect x="9" y="138" transform="matrix(1 2.469760e-03 -2.469760e-03 1 0.3768 -5.505154e-02)" class="house" width="27" height="29"></rect>
                <rect x="50.6" y="140.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 5.3195 -2.3725)" class="house" width="40" height="21"></rect>
                <rect x="-2.3" y="97.8" transform="matrix(2.621060e-02 -0.9997 0.9997 2.621060e-02 -85.3108 124.3564)" class="house" width="46.9" height="16.3"></rect>
                <rect x="82.4" y="7.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -1.775 10.1492)" class="house" width="27" height="29"></rect>
                <rect x="120.6" y="8.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 0.7554 -4.8959)" class="house" width="40" height="21"></rect>
                <rect x="10.2" y="8.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 1.246 -1.2098)" class="house" width="27" height="29"></rect>
                <rect x="10.4" y="44.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -6.037 2.8258)" class="house" width="27" height="29"></rect>
                <rect x="56.8" y="49.9" transform="matrix(0.9985 5.466146e-02 -5.466146e-02 0.9985 3.6391 -4.2093)" class="house" width="44" height="29"></rect>
                <rect x="58.6" y="90.7" transform="matrix(0.9492 0.3148 -0.3148 0.9492 35.8549 -19.6061)" class="house" width="40" height="21"></rect>
                <rect x="37.7" y="111.8" transform="matrix(-0.9991 4.172154e-02 -4.172154e-02 -0.9991 95.4948 241.686)" class="house" width="15" height="20"></rect>
                <rect x="174.7" y="6.8" transform="matrix(6.637418e-02 0.9978 -0.9978 6.637418e-02 186.9327 -166.1018)" class="house" width="15" height="20"></rect>
                
                <rect v-for="(bridge, key) in BridgePaths[ActiveMap]" :class="[ 'bridge', ValidBridges.includes(key) ? 'green' : '', ErrorOccured ? 'red' : '' ]" :x="bridge[0]" :y="bridge[1]" :width="bridge[2]" :height="bridge[3]" :transform="bridge[5]"></rect>
            </svg>

            <div id="Canvas">

            </div>

        </div>

    </section>

    <canvas id="myCanvas"></canvas>

    <div style="display: none !important;">

        <svg :id="`${ActiveMap}Bridges`" viewBox="0 0 640 400" style="width: 100%">
            <rect v-for="bridge in BridgePaths[ActiveMap]" :x="bridge[0]" :y="bridge[1]" :width="bridge[2]" :height="bridge[3]" :transform="bridge[5]"></rect>
        </svg>

    </div>

    <Footer />
</template>

<style lang="scss">

    #container-map-bridges {
        position: relative;

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

    .house{
        fill:#eee
    }

    html[theme=dark] .house{
        fill:#383742
    }

    .bridge{
        fill:#fd8c00;
        stroke:transparent;
        stroke-width:16px;
        transition:fill .2s
    }

    .bridge.green{
        fill: #4CAF50
    }

    .bridge.red{
        fill: #F44336;
    }

    .water{
        fill:#57a8f6
    }

</style>