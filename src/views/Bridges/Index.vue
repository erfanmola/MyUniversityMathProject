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

    const ActiveMap = ref('Map1');

    const BridgePaths = {
        'Map1': [
            [ 200, 62  , 30, 50, true  ],
            [ 230, 230 , 30, 54, true  ],
            [ 300, 230 , 30, 50, true  ],
            [ 520, 62  , 30, 50, true  ],
            [ 400, 160 , 50, 30, false ],
            [ 340, 65  , 30, 50, true  ],
            [ 470, 312 , 30, 50, true  ],
        ],
        'Map2': [
            [ 400, 82, 30, 60, true  ],
            [ 190, 90, 30, 60, true  ],
            [ 220, 192, 30, 66, true  ],
            [ 440, 180, 30, 60, true ],
            [ 290, 160, 60, 30, false  ],
            [ 285, 350, 60, 30, false  ],
        ],
        'Map3': [
            [ 220, 45, 30, 80, true  ],
            [ 340, 42, 30, 80, true  ],
            [ 240, 242, 30, 70, true  ],
            [ 330, 242, 30, 75, true  ],
            [ 60, 145, 30, 60, true  ],
            [ 520, 145, 30, 60, true  ],
            [ 272, 350, 60, 30, false  ],
        ],
        'Map4': [
            [ 270, 72, 30, 60, true  ],
            [ 310, 232, 30, 60, true  ],
            [ 50, 280, 30, 60, true  ],
            [ 500, 90, 30, 60, true  ],
            [ 388, 180, 60, 30, false  ],
            [ 420, 340, 70, 30, false  ],
        ],
    };

    const WaterPaths = {
        'Map1': "M521,106l64-7l55,0.7V66.1L576,61l-58,10h-87l-86,6l-80-9l-98,3l-19,15v62v49l-14,51l-66,4l-68-6.9V284h37 l61-1l68,1l64-6l62-6l57,1l21,1l11,17l18,32l40,28l45,6h45l48-15l41-19l22-6.4v-41.2l-26,7.7l-47,25l-51,15l-56-5l-33-28v-46l10-37 l9-46l-1-40l10-12L521,106z M414,147l-10,41l-5,38l-12,14h-26l-40-3h-50l-43,1l-47,8l-4-15l8-37l-1-47l1-33l18-12l54-2l53,6l50,1 l37-3l18,10L414,147z",
        'Map2': "M619.3,164.7l-44.2-7.4l-51.2-18.7L472.7,110l-68.6-20.6l-68.6-10.6l-66.3,4.9l-66.3,12.9l-56.6,21.5l-48.6,25.5l-50,12.8L0,157.1v35.4l8.3-0.8l31-3.6l37.1,1.4l44.2,10.5l37.6,10.8l37.6,11.8l36.5,19.6l26.5,23.6l21,33.4l11,35.4l4.7,35.9l-2.7,29.5h39.5l0.7-27.3l4.9-35.5l8.9-28.2l14.9-28.2l35.1-25.7l37.1-17.7l45.9-19.7l51.9-13.7l65.3-6l43.3,4v-37.6L619.3,164.7z M302.7,177l-4.3,37.7l-6,24.4l-4.9,1.9l-36.1-28.7l-38.7-21.9l-36.5-13.4l-36.1-8.5l19.7-13.1l54.2-19.9l75.8-12.4l13.7,5.3L302.7,177z M455,190l-49.7,18.7l-60,30l-14-2.7l1.7-60.9l7.1-54.3l52.5,6.5l61.4,18.3l43.3,20.7l8.3,8.8L455,190z",
        'Map3': "M580.8,154.7l-88-5.8l-34.3,0.1l-23-10.9l-26.4-43.8l-38.7-31.5L333.1,42l-20.4-16l-1.7-26H272l0.4,8.9l-3.3,28.9l-22.8,11.8l-48.8,32.3l-35.5,43.6l-17.5,20.3l-44.7,5.7l-71.6,3.5L0,158.5v40.3l31.8-4.1l66.4-3.3l49.1,11.1l40,50.7L245,301l26.3,8l10.2,13.9l0.5,29l0,48h41.8l-1.5-37l2.7-41l8.3-11l39.7-23.7l40.9-39.5l23.5-46.1l13.8-11.9l41.9-1.9l88,6.8l58.8-5.6v-40.2L580.8,154.7z M395.8,187.9l-17.4,37.6l-23.7,25.9l-43.3,14.5l-51.9-3.8l-38.6-31.8l-23.3-42.8l7.1-46.5l19.1-29.3l34.4-23.1l48.1-4.6l43,14.5l25.1,20.5l22,31.5L395.8,187.9z",
        'Map4': "M580.6,101.8l-67.3,1l-45.8-5.8l-45.8-5.8l-42.4-5.2l-42.4-5.2l-49.6,0.6l-49.6,6.6l-46.9,14.2l-34.9,22.2l-11.4,42.1l0.6,42.1v29.1l-2.3,23.2l-9.3,8.9l-28.5,10.1l-56.5,11L0,291.8v39.8l54.7-1.1l58.6-11.2l50.7-20.5l50.7-12.5l45.9-6.7l54.9,0.3l44.4,7.1l43.4,12.1l19.1,30.5l15.1,30.5l7.9,24.6l2.4,15.4h40.5l-4.1-25.7l-9.5-28.6l-14.1-30.5l-16.1-30.5l-6.7-30.4l-1.7-30.4l2.7-29.4l4.7-29.4l2.7-15.1l5.6-11.4l29.1,0.4l38.6,1.6l63.1-2.8l57.6-7.7V90.3L580.6,101.8z M404,158.4l-5.2,32.4l-4.2,30.4l1.1,18.8l2.1,16.8l-44.4-10.2l-44.4-7.2l-48.7-0.4l-34.9,6l-24.6,5.4l-12.3-1.8l-6.3-16.1v-21.3l2.8-29.7l7.8-29.7l23.5-17.2l31.5-7.2l44.2-6.2l44.2-0.2l36.6,4.5l30.9,7.4l3.2,11.2L404,158.4z",
    };

    let Accomplishments = ref({});

    let ValidBridges = ref([]);

    let draw, interval, AspectRatio, WaterPath;

    let Bridges = ref([]);
    let BridgesCalculated = ref([]);

    let BridgePathsCalculated = ref([]);

    const CalculateValues = () => {

        AspectRatio = document.querySelector('#Canvas > svg').width.baseVal.value / 640;
        WaterPath   = SerializePath(ScalePath(ParsePath(WaterPaths[ActiveMap.value]), AspectRatio));

        Bridges.value = [];
        BridgesCalculated.value = [];
        BridgePathsCalculated.value = [];

        ValidBridges.value = [];

        BridgePaths[ActiveMap.value].forEach((Bridge) => {

            const path = toPath({
                type: 'element',
                name: 'rect',
                attributes: {
                    x: Bridge[0],
                    y: Bridge[1],
                    width: Bridge[2],
                    height: Bridge[3],
                }
            });

            Bridges.value.push(path);
            BridgesCalculated.value.push(SerializePath(ScalePath(ParsePath(path), AspectRatio)));
            BridgePathsCalculated.value.push(Bridge.map((item) => { return item * AspectRatio; }));

        });

    };

    onMounted(() => {

        document.body.addEventListener('pointerup', DrawingEnd);
        document.body.addEventListener('touchend', DrawingEnd);

        draw = new SvgDrawing(document.getElementById('Canvas'), {
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

        document.querySelectorAll('#Canvas > svg > path').forEach((line, index) => {

            const LinePath = line.getAttribute('d') ?? null;

            if (LinePath) {

                let WaterIntersections = intersect(WaterPath, LinePath);

                if (WaterIntersections.length > 0) {

                    WaterIntersections = WaterIntersections.filter((WaterIntersection) => {

                        let ValidWaterIntersection = true;

                        BridgePathsCalculated.value.forEach(BridgePath => {
                            
                            if (WaterIntersection.x >= BridgePath[0] && WaterIntersection.x <= (BridgePath[0] + BridgePath[2]) && WaterIntersection.y >= BridgePath[1] && WaterIntersection.y <= (BridgePath[1] + BridgePath[3])) {

                                ValidWaterIntersection = false;

                            }

                        });

                        return ValidWaterIntersection;

                    });

                }

                if (WaterIntersections.length > 0) {

                    draw.drawEnd();

                    ResetError("افتادی توی رودخونه");

                }else{

                    BridgesCalculated.value.forEach((bridge, bridgeId) => {
                        
                        const BridgePathCalculated = BridgePathsCalculated.value[bridgeId];

                        let status = [false, false];

                        const intersections = intersect(bridge, LinePath);

                        if (intersections.length <= 2) {

                            if (!(ValidBridges.value.includes(bridgeId))) {

                                if (BridgePathCalculated[4]) {

                                    intersections.forEach((collision) => {

                                        if (Math.round(collision['bez1'][0]) === Math.round(BridgePathCalculated[0]) && Math.round(collision['bez1'][1]) === Math.round(BridgePathCalculated[1])) {

                                            status[0] = true;

                                        }else if (Math.round(collision['bez1'][0]) === Math.round(BridgePathCalculated[0] + BridgePathCalculated[2]) && Math.round(collision['bez1'][1]) === Math.round(BridgePathCalculated[1] + BridgePathCalculated[3])) {

                                            status[1] = true;

                                        }

                                    });

                                }else{

                                    intersections.forEach((collision) => {

                                        if (Math.round(collision['bez1'][0]) === Math.round(BridgePathCalculated[0]) && Math.round(collision['bez1'][1]) === Math.round(BridgePathCalculated[1] + BridgePathCalculated[3])) {

                                            status[0] = true;

                                        }else if (Math.round(collision['bez1'][0]) === Math.round(BridgePathCalculated[0] + BridgePathCalculated[2]) && Math.round(collision['bez1'][1]) === Math.round(BridgePathCalculated[1])) {

                                            status[1] = true;

                                        }

                                    });

                                }

                                if (status[0] && status[1]) {

                                    ValidBridges.value.push(bridgeId);

                                }

                            }

                        }else{

                            ResetError("پل نمی‌تونه تکراری باشه");

                        }

                    });

                }

            }

        });

    };

    onUnmounted(() => {

        clearInterval(interval);

        document.body.removeEventListener('pointerup', DrawingEnd);
        document.body.removeEventListener('touchend', DrawingEnd);

    });

    const ResetMap = () => {

        clearInterval(interval);

        draw.clear();
        ErrorOccured.value = false;

        setTimeout(() => {
        
            ValidBridges.value = [];

            interval = setInterval(HandleCycle, TickRate);

        }, TickRate);

    };
    
    const ResetError = (reason = "خطا") => {

        ResetMap();
        ErrorOccured.value = true;
        Utils.Toast(reason);

        setTimeout(() => { ErrorOccured.value = false; }, 1000);

        Accomplishments.value[ActiveMap.value] = false;

    };

    const DrawingEnd = () => {

        if (!(ActiveMap.value in Accomplishments.value && Accomplishments.value[ActiveMap.value])) {

            ResetMap();

        }

    };

    watch(ActiveMap, () => { CalculateValues(); });

    watch(ValidBridges, () => {

        if (ValidBridges.value.length === BridgePaths[ActiveMap.value].length) {

            draw.drawEnd();

            Accomplishments.value[ActiveMap.value] = true;

            Utils.Toast("چه عجب تونستی (:");

        }

    }, { deep: true });
</script>

<template>
    <Header />
    
    <section id="container-bridges" class="section">
        
        <div id="story">
            <h2>پل‌های کونیگسبرگ</h2>

            <p>یکی از اولین ریاضیدان هایی که درمورد گراف‌ها و شبکه‌ها به‌صورت گسترده تحقیق کرد و ما رو بدبخت کرد، لئونارد اویلر بود، اویلر درمورد یکی از مسائل قدیمی تاریخ که مربوط به شهر کونیگسبرگ در نزدیکی دریای بالتیک بود، تحقیقات زیادی کرد</p>

            <p>شهر کونیگسبرگ توسط رودخانه‌ای که از اون عبور می‌کنه به 4 بخش مختلف تقسیم می‌شه و این بخش‌ها با استفاده از 7 پل مختلف به‌یکدیگر متصل می‌شن و با استفاده از این پل‌ها می‌تونیم در کل شهر قدم بزنیم، اما مسئله‌ای که مطرح می‌شه این هست که : آیا می‌تونیم در شهر قدم بزنیم، به‌طوری که از تمامی پل‌ها بگذریم، به‌شرطی که از هر پل فقط یک‌بار بگذریم ؟ در کادر زیر می‌تونیم با کشیدن خطوط امتحان کنیم و ببینیم که می‌شه یا نمی‌شه : (برای تجربه ترسیم راحت‌تر، از دسکتاپ استفاده کنید)</p>
        </div>

        <div id="container-bridges-frame">

            <ul>
                <li v-for="i in 4" :class="ActiveMap === `Map${i}` ? 'active' : ''" @click="ActiveMap = `Map${i}`">
                    <i v-if="`Map${i}` in Accomplishments" :class="Accomplishments[`Map${i}`] ? 'icon-check-circle' : 'icon-x-circle'"></i>
                    شهر {{ i }}
                </li>
            </ul>

            <div id="container-map-bridges">

                <svg :id="ActiveMap" viewBox="0 0 640 400">

                    <g v-if="ActiveMap === 'Map1'">
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
                    </g>

                    <g v-if="ActiveMap === 'Map2'">
                        <rect x="194.7" y="150.1" transform="matrix(0.9164 0.4004 -0.4004 0.9164 83.3241 -69.5814)" class="house" width="27" height="29"></rect>
                        <rect x="255.6" y="134.7" transform="matrix(0.9979 -6.540180e-02 6.540180e-02 0.9979 -8.9057 18.337)" class="house" width="40" height="21"></rect>
                        <rect x="461.7" y="160.8" transform="matrix(0.4142 0.9102 -0.9102 0.4142 430.3787 -327.0054)" class="house" width="15" height="20"></rect>
                        <rect x="352.4" y="180.9" transform="matrix(0.4318 0.902 -0.902 0.4318 391.4367 -212.5788)" class="house" width="24" height="47"></rect>
                        <rect x="421.4" y="156.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -15.4927 46.4006)" class="house" width="27" height="29"></rect>
                        <rect x="351.4" y="129.5" transform="matrix(-0.1496 0.9887 -0.9887 -0.1496 561.9343 -195.2767)" class="house" width="27" height="29"></rect>
                        <rect x="270.7" y="202.8" transform="matrix(-0.7227 0.6912 -0.6912 -0.7227 626.4043 174.3495)" class="house" width="15" height="20"></rect>
                        <rect x="216.8" y="257.8" transform="matrix(0.6823 0.7311 -0.7311 0.6823 272.2569 -81.8157)" class="house" width="27" height="29"></rect>
                        <rect x="238.9" y="286.9" transform="matrix(0.4698 0.8828 -0.8828 0.4698 399.8651 -63.043)" class="house" width="27" height="29"></rect>
                        <rect x="254.4" y="320.9" transform="matrix(0.423 0.9061 -0.9061 0.423 458.4907 -49.1791)" class="house" width="27" height="29"></rect>
                        <rect x="95.3" y="96.2" transform="matrix(0.8043 -0.5943 0.5943 0.8043 -44.4832 86.294)" class="house" width="27" height="29"></rect>
                        <rect x="130.1" y="76.7" transform="matrix(0.9307 -0.3659 0.3659 0.9307 -23.4251 58.856)" class="house" width="27" height="29"></rect>
                        <rect x="169.7" y="63.3" transform="matrix(0.9485 -0.3167 0.3167 0.9485 -15.2048 62.0014)" class="house" width="27" height="29"></rect>
                        <rect x="44.6" y="119.7" transform="matrix(0.9663 -0.2576 0.2576 0.9663 -31.3511 21.0355)" class="house" width="40" height="21"></rect>
                        <rect x="10.4" y="99.9" transform="matrix(0.9999 -1.414569e-02 1.414569e-02 0.9999 -1.7434 0.3299)" class="house" width="24" height="47"></rect>
                        <rect x="10.7" y="199.8" transform="matrix(0.9951 -9.852698e-02 9.852698e-02 0.9951 -20.3241 4.379)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="235.7" y="376.8" class="house" width="46.9" height="16.3"></rect>
                        <rect x="326" y="45" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -3.3252 23.8258)" class="house" width="27" height="29"></rect>
                        <rect x="367.2" y="49.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 3.881 -19.8375)" class="house" width="27" height="29"></rect>
                        <rect x="250" y="51" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -3.9288 18.5389)" class="house" width="27" height="29"></rect>
                        <rect x="494.4" y="66.6" transform="matrix(0.8421 0.5393 -0.5393 0.8421 128.292 -259.8242)" class="house" width="27" height="45.3"></rect>
                        <rect x="523.8" y="100.7" transform="matrix(0.9177 0.3973 -0.3973 0.9177 89.9736 -203.9937)" class="house" width="27" height="29"></rect>
                        <rect x="563.1" y="117.2" transform="matrix(0.9372 0.3487 -0.3487 0.9372 82.1031 -192.7836)" class="house" width="27" height="29"></rect>
                        <rect x="603.5" y="126.9" transform="matrix(0.9627 0.2707 -0.2707 0.9627 60.4061 -161.8494)" class="house" width="27" height="22.4"></rect>
                        <rect x="442" y="57" transform="matrix(0.9587 0.2843 -0.2843 0.9587 40.5411 -128.2438)" class="house" width="40" height="37"></rect>
                        <rect x="110.6" y="212.3" transform="matrix(0.9867 0.1624 -0.1624 0.9867 38.4682 -17.1446)" class="house" width="27" height="29"></rect>
                        <rect x="147.7" y="226.3" transform="matrix(0.9545 0.2981 -0.2981 0.9545 78.2314 -39.222)" class="house" width="40" height="21"></rect>
                        <rect x="69.5" y="203.1" transform="matrix(0.973 0.2308 -0.2308 0.973 52.4521 -13.2722)" class="house" width="27" height="29"></rect>
                        <rect x="129.5" y="259.7" transform="matrix(0.9815 0.1914 -0.1914 0.9815 55.8529 -24.7359)" class="house" width="53" height="34"></rect>
                        <rect x="11" y="242.6" transform="matrix(0.9815 0.1914 -0.1914 0.9815 49.5541 -3.8149)" class="house" width="67" height="24"></rect>
                        <rect x="49.5" y="80.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -3.2778 2.2565)" class="house" width="27" height="29"></rect>
                        <rect x="134" y="30" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -2.7465 10.396)" class="house" width="27" height="29"></rect>
                        <rect x="170.6" y="8.7" transform="matrix(0.9986 5.233590e-02 -5.233590e-02 0.9986 1.858 -9.5938)" class="house" width="27" height="44"></rect>
                        <rect x="53" y="44" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -3.9204 4.7799)" class="house" width="27" height="29"></rect>
                        <rect x="3.8" y="48.9" transform="matrix(-1.542559e-02 0.9999 -0.9999 -1.542559e-02 89.5785 38.6342)" class="house" width="44" height="29"></rect>
                        <rect x="113.7" y="5.8" transform="matrix(0.9994 3.489964e-02 -3.489964e-02 0.9994 0.571 -4.7788)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="56.3" y="6.3" transform="matrix(0.9994 -3.489963e-02 3.489963e-02 0.9994 -0.6784 2.6857)" class="house" width="40.6" height="29"></rect>
                        <rect x="16.2" y="5.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 1.0972 -1.5279)" class="house" width="27" height="29"></rect>
                        <rect x="571.7" y="211.8" transform="matrix(0.9346 -0.3556 0.3556 0.9346 -42.2081 222.8792)" class="house" width="27" height="29"></rect>
                        <rect x="496.8" y="221.6" transform="matrix(0.9346 -0.3556 0.3556 0.9346 -50.6151 196.898)" class="house" width="27" height="29"></rect>
                        <rect x="531.8" y="212.6" transform="matrix(0.971 -0.2391 0.2391 0.971 -38.4829 136.9335)" class="house" width="27" height="29"></rect>
                        <rect x="447.1" y="243.4" transform="matrix(0.2748 0.9615 -0.9615 0.2748 588.1718 -264.0223)" class="house" width="44" height="29"></rect>
                        <rect x="601.6" y="219.7" transform="matrix(3.681944e-02 0.9993 -0.9993 3.681944e-02 828.7692 -399.4838)" class="house" width="40" height="21"></rect>
                        <rect x="394.4" y="262.8" transform="matrix(-0.8053 0.5929 -0.5929 -0.8053 900.8162 258.7004)" class="house" width="27" height="29"></rect>
                        <rect x="365.3" y="286.7" transform="matrix(-0.5246 0.8514 -0.8514 -0.5246 834.0316 136.7267)" class="house" width="27" height="29"></rect>
                        <rect x="351.4" y="323.2" transform="matrix(-0.2358 0.9718 -0.9718 -0.2358 779.0886 62.7271)" class="house" width="27" height="29"></rect>
                        <rect x="576.5" y="77.7" transform="matrix(0.9815 0.1914 -0.1914 0.9815 29.2809 -113.6629)" class="house" width="53" height="34"></rect>
                        <rect x="8.1" y="357.5" transform="matrix(5.094785e-02 0.9987 -0.9987 5.094785e-02 392.0239 331.4958)" class="house" width="27" height="29"></rect>
                        <rect x="52.7" y="284.7" transform="matrix(-7.114301e-02 0.9975 -0.9975 -7.114301e-02 369.2642 254.4609)" class="house" width="27" height="29"></rect>
                        <rect x="9.5" y="275.4" transform="matrix(5.094785e-02 0.9987 -0.9987 5.094785e-02 311.391 252.1479)" class="house" width="27" height="29"></rect>
                        <rect x="9.2" y="316.8" transform="matrix(-7.114301e-02 0.9975 -0.9975 -7.114301e-02 354.7035 332.2369)" class="house" width="27" height="29"></rect>
                        <rect x="78.8" y="366.2" transform="matrix(-0.9984 5.728294e-02 -5.728294e-02 -0.9984 206.2594 755.5436)" class="house" width="27" height="29"></rect>
                        <rect x="44.6" y="353" transform="matrix(-0.9979 -6.481336e-02 6.481336e-02 -0.9979 92.2175 738.0895)" class="house" width="27" height="29"></rect>
                        <rect x="154.8" y="364.2" transform="matrix(-0.9984 5.728294e-02 -5.728294e-02 -0.9984 358.0803 747.092)" class="house" width="27" height="29"></rect>
                        <rect x="117.6" y="366" transform="matrix(-0.9979 -6.481336e-02 6.481336e-02 -0.9979 237.184 768.792)" class="house" width="27" height="29"></rect>
                        <rect x="192.2" y="355.9" transform="matrix(2.792146e-02 -0.9996 0.9996 2.792146e-02 -162.0366 574.0789)" class="house" width="44" height="29"></rect>
                        <rect x="565.8" y="367.6" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -25.0222 42.7267)" class="house" width="67" height="24"></rect>
                        <rect x="606" y="259" class="house" width="27" height="29"></rect>
                        <rect x="479.4" y="361.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -36.6033 53.5863)" class="house" width="27" height="29"></rect>
                        <rect x="517.6" y="365.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 13.4564 -18.5336)" class="house" width="40" height="21"></rect>
                        <rect x="437.3" y="363.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -12.9179 15.963)" class="house" width="27" height="29"></rect>
                        <rect x="386.6" y="372.7" transform="matrix(0.9994 -3.566528e-02 3.566528e-02 0.9994 -13.4079 14.7461)" class="house" width="40" height="21"></rect>
                        <rect x="585.5" y="308.7" transform="matrix(5.348533e-02 0.9986 -0.9986 5.348533e-02 904.4891 -302.7786)" class="house" width="53" height="34"></rect>
                        <rect x="555.2" y="326.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 18.6357 -29.2971)" class="house" width="27" height="29"></rect>
                        <rect x="438" y="324" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -22.5144 32.3182)" class="house" width="27" height="29"></rect>
                        <rect x="475.2" y="321.7" transform="matrix(0.9986 5.233596e-02 -5.233596e-02 0.9986 18.2644 -25.117)" class="house" width="27" height="29"></rect>
                        <rect x="551.8" y="253.9" transform="matrix(-0.9771 -0.2128 0.2128 -0.9771 1077.2667 652.8009)" class="house" width="44" height="29"></rect>
                        <rect x="554.1" y="289.2" transform="matrix(-0.12 0.9928 -0.9928 -0.12 937.1429 -223.3689)" class="house" width="27" height="29"></rect>
                        <rect x="84.2" y="299.9" transform="matrix(4.408571e-02 -0.999 0.999 4.408571e-02 -212.5757 406.5415)" class="house" width="44" height="29"></rect>
                        <rect x="130.6" y="302.3" transform="matrix(0.9867 0.1624 -0.1624 0.9867 53.347 -19.1977)" class="house" width="27" height="29"></rect>
                        <rect x="404.4" y="335.2" transform="matrix(-0.9969 7.837562e-02 -7.837562e-02 -0.9969 861.8836 665.5521)" class="house" width="27" height="29"></rect>
                        <rect x="508.7" y="274.8" transform="matrix(-0.167 -0.986 0.986 -0.167 342.0489 854.9213)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="482.7" y="278.8" transform="matrix(-2.517164e-02 -0.9997 0.9997 -2.517164e-02 232.0399 800.2042)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="381.1" y="9.1" transform="matrix(-0.9988 4.866528e-02 -4.866528e-02 -0.9988 829.7026 21.908)" class="house" width="67" height="24"></rect>
                        <rect x="511.3" y="6.4" transform="matrix(-0.9996 -2.969916e-02 2.969916e-02 -0.9996 1048.7432 57.4252)" class="house" width="27" height="29"></rect>
                        <rect x="458.1" y="7.3" transform="matrix(-0.9889 0.1489 -0.1489 -0.9889 953.5862 -35.7806)" class="house" width="40" height="21"></rect>
                        <rect x="549.5" y="7.3" transform="matrix(-0.9999 1.377745e-02 -1.377745e-02 -0.9999 1126.1906 35.8641)" class="house" width="27" height="29"></rect>
                        <rect x="587.3" y="9.1" transform="matrix(-0.9999 1.454365e-02 -1.454365e-02 -0.9999 1214.722 30.3009)" class="house" width="40" height="21"></rect>
                        <rect x="604.7" y="40.8" transform="matrix(0.9982 -6.036947e-02 6.036947e-02 0.9982 -2.208 37.4185)" class="house" width="27" height="29"></rect>
                        <rect x="243.4" y="10" transform="matrix(8.689240e-02 0.9962 -0.9962 8.689240e-02 261.1335 -235.9777)" class="house" width="31.9" height="29"></rect>
                        <rect x="207.8" y="8" transform="matrix(0.9986 -5.259272e-02 5.259272e-02 0.9986 -0.8697 11.6911)" class="house" width="27.7" height="28.7"></rect>
                        <rect x="325.8" y="9.2" transform="matrix(0.9921 0.1254 -0.1254 0.9921 5.7148 -43.4314)" class="house" width="44" height="29"></rect>
                        <rect x="286" y="5.8" transform="matrix(0.9869 -0.1615 0.1615 0.9869 0.6531 48.6459)" class="house" width="27" height="29"></rect>
                        <rect x="571" y="43.1" transform="matrix(-0.9988 4.866528e-02 -4.866528e-02 -0.9988 1168.4454 78.2507)" class="house" width="24.5" height="20.5"></rect>
                        <rect x="484" y="37.1" transform="matrix(-0.4013 -0.916 0.916 -0.4013 652.0462 520.9103)" class="house" width="24.5" height="20.5"></rect>
                    </g>
                    
                    <g v-if="ActiveMap === 'Map3'">
                        <rect x="266.5" y="95.7" transform="matrix(0.9996 -2.665085e-02 2.665085e-02 0.9996 -2.9002 7.8477)" class="house" width="53" height="34"></rect>
                        <rect x="212.7" y="177.5" transform="matrix(-5.783492e-02 -0.9983 0.9983 -5.783492e-02 47.6149 428.9632)" class="house" width="27" height="29"></rect>
                        <rect x="212.4" y="136.9" transform="matrix(0.2025 -0.9793 0.9793 0.2025 31.8845 342.005)" class="house" width="27" height="29"></rect>
                        <rect x="352.2" y="132.7" transform="matrix(0.8911 -0.4538 0.4538 0.8911 -26.9867 182.0049)" class="house" width="27" height="29"></rect>
                        <rect x="286.9" y="230.7" transform="matrix(0.9955 -9.506034e-02 9.506034e-02 0.9955 -21.5401 30.2709)" class="house" width="40" height="21"></rect>
                        <rect x="254.5" y="204.1" transform="matrix(0.9886 0.1506 -0.1506 0.9886 37.3032 -37.5256)" class="house" width="24" height="47"></rect>
                        <rect x="297.6" y="191.8" transform="matrix(0.9915 0.13 -0.13 0.9915 29.4558 -38.6995)" class="house" width="27" height="29"></rect>
                        <rect x="355.4" y="177.5" transform="matrix(-0.2985 0.9544 -0.9544 -0.2985 662.3382 -102.7856)" class="house" width="27" height="29"></rect>
                        <rect x="251.4" y="142.9" transform="matrix(0.9999 -1.414569e-02 1.414569e-02 0.9999 -2.3275 3.7433)" class="house" width="24" height="47"></rect>
                        <rect x="45.2" y="202.7" transform="matrix(0.9989 -4.609893e-02 4.609893e-02 0.9989 -9.9496 2.9379)" class="house" width="27" height="29"></rect>
                        <rect x="526.8" y="281.8" transform="matrix(-0.9906 0.1368 -0.1368 -0.9906 1116.0043 516.0034)" class="house" width="27" height="29"></rect>
                        <rect x="556.4" y="244.3" transform="matrix(-0.9968 7.946345e-02 -7.946345e-02 -0.9968 1171.181 462.9392)" class="house" width="40" height="21"></rect>
                        <rect x="606.6" y="240" transform="matrix(-0.9999 1.549197e-02 -1.549197e-02 -0.9999 1241.1321 517.3932)" class="house" width="24" height="47"></rect>
                        <rect x="603.1" y="201.2" transform="matrix(-0.9975 7.109948e-02 -7.109948e-02 -0.9975 1246.995 387.0322)" class="house" width="27" height="29"></rect>
                        <rect x="439.5" y="344.4" transform="matrix(-0.9987 -5.099126e-02 5.099126e-02 -0.9987 886.7628 755.512)" class="house" width="27" height="44"></rect>
                        <rect x="561.1" y="319.9" transform="matrix(-0.9975 7.109948e-02 -7.109948e-02 -0.9975 1171.5618 627.1867)" class="house" width="27" height="29"></rect>
                        <rect x="520.9" y="323.3" transform="matrix(-0.9987 -5.099126e-02 5.099126e-02 -0.9987 1050.8308 702.4836)" class="house" width="27" height="29"></rect>
                        <rect x="595.3" y="313" transform="matrix(1.407930e-02 -0.9999 0.9999 1.407930e-02 281.1722 940.142)" class="house" width="44" height="29"></rect>
                        <rect x="478.5" y="374.9" transform="matrix(-0.9994 -3.355389e-02 3.355389e-02 -0.9994 990.8286 782.8187)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="542.3" y="361.7" transform="matrix(-0.9993 3.624519e-02 -3.624519e-02 -0.9993 1138.3795 731.772)" class="house" width="40.6" height="29"></rect>
                        <rect x="599.9" y="362.2" transform="matrix(-0.9987 -5.099126e-02 5.099126e-02 -0.9987 1206.8442 784.251)" class="house" width="27" height="29"></rect>
                        <rect x="352.7" y="357.3" transform="matrix(-4.475069e-02 -0.999 0.999 -4.475069e-02 0.9075 760.7567)" class="house" width="22.9" height="45.2"></rect>
                        <rect x="399.6" y="360.4" transform="matrix(-0.9985 5.393715e-02 -5.393715e-02 -0.9985 846.4941 726.7653)" class="house" width="27.7" height="28.7"></rect>
                        <rect x="480.8" y="197.2" transform="matrix(-0.9829 0.1841 -0.1841 -0.9829 1019.105 328.7722)" class="house" width="27" height="29"></rect>
                        <rect x="441.4" y="210.1" transform="matrix(-0.4971 0.8677 -0.8677 -0.4971 875.915 -58.4198)" class="house" width="27" height="29"></rect>
                        <rect x="424.1" y="243.9" transform="matrix(-0.5456 0.8381 -0.8381 -0.5456 892.8592 32.5753)" class="house" width="27" height="29"></rect>
                        <rect x="546.3" y="201" transform="matrix(0.9992 4.096386e-02 -4.096386e-02 0.9992 9.3044 -23.0998)" class="house" width="44" height="29"></rect>
                        <rect x="376" y="290.6" transform="matrix(-0.7995 0.6007 -0.6007 -0.7995 884.0871 315.0854)" class="house" width="27" height="29"></rect>
                        <rect x="344.7" y="311.1" transform="matrix(-0.8298 0.5581 -0.5581 -0.8298 837.1779 395.9475)" class="house" width="27" height="29"></rect>
                        <rect x="477.8" y="284.9" transform="matrix(0.1024 -0.9947 0.9947 0.1024 150.747 765.9023)" class="house" width="44" height="29"></rect>
                        <rect x="518.9" y="242.3" transform="matrix(-0.9884 0.1518 -0.1518 -0.9884 1097.5693 429.8888)" class="house" width="27" height="29"></rect>
                        <rect x="434" y="292.8" transform="matrix(5.652282e-02 -0.9984 0.9984 5.652282e-02 136.8093 746.7453)" class="house" width="58.9" height="16.3"></rect>
                        <rect x="406" y="319.6" transform="matrix(-0.9992 -4.102476e-02 4.102476e-02 -0.9992 824.8402 685.1522)" class="house" width="27" height="29"></rect>
                        <rect x="478.9" y="238.3" transform="matrix(-1 -2.133519e-03 2.133519e-03 -1 984.2122 506.7245)" class="house" width="27" height="29"></rect>
                        <rect x="8.1" y="8.2" transform="matrix(-0.9976 6.874586e-02 -6.874586e-02 -0.9976 84.4404 37.5834)" class="house" width="67" height="24"></rect>
                        <rect x="7.7" y="111.9" transform="matrix(-1 -1.012953e-03 1.012953e-03 -1 51.315 252.7505)" class="house" width="36" height="29"></rect>
                        <rect x="83.2" y="13.2" transform="matrix(-0.9994 -3.591185e-02 3.591185e-02 -0.9994 205.4888 51.1897)" class="house" width="40" height="21"></rect>
                        <rect x="176.5" y="7.5" transform="matrix(-0.9994 3.388725e-02 -3.388725e-02 -0.9994 380.6896 37.5795)" class="house" width="27" height="29"></rect>
                        <rect x="214.2" y="6.4" transform="matrix(-0.9994 3.465308e-02 -3.465308e-02 -0.9994 468.8666 25.638)" class="house" width="40" height="21"></rect>
                        <rect x="2.3" y="57.1" transform="matrix(-5.247379e-02 -0.9986 0.9986 -5.247379e-02 -43.71 106.8045)" class="house" width="53" height="34"></rect>
                        <rect x="99.8" y="44.9" transform="matrix(-0.9976 6.874586e-02 -6.874586e-02 -0.9976 230.4389 110.9263)" class="house" width="27" height="29"></rect>
                        <rect x="138.8" y="8" transform="matrix(-0.9976 6.874586e-02 -6.874586e-02 -0.9976 305.8042 34.4867)" class="house" width="27" height="29"></rect>
                        <rect x="138.6" y="49.3" transform="matrix(-0.9986 -5.334743e-02 5.334743e-02 -0.9986 300.5043 135.6289)" class="house" width="27" height="29"></rect>
                        <rect x="114.9" y="98" transform="matrix(-0.611 0.7917 -0.7917 -0.611 309.6673 72.7892)" class="house" width="44" height="29"></rect>
                        <rect x="70.7" y="71.3" transform="matrix(5.102821e-02 -0.9987 0.9987 5.102821e-02 -16.7889 175.9218)" class="house" width="27" height="51"></rect>
                        <rect x="201.1" y="41.7" transform="matrix(0.7028 -0.7114 0.7114 0.7028 28.1193 167.61)" class="house" width="27" height="17"></rect>
                        <rect x="451.9" y="104.6" transform="matrix(-0.9914 -0.1309 0.1309 -0.9914 936.7176 304.8354)" class="house" width="53" height="34"></rect>
                        <rect x="555.1" y="96.9" transform="matrix(-0.9999 -1.324654e-02 1.324654e-02 -0.9999 1135.5022 247.2949)" class="house" width="27" height="46"></rect>
                        <rect x="599.9" y="12.8" transform="matrix(-4.383713e-02 -0.999 0.999 -4.383713e-02 613.023 641.3345)" class="house" width="27" height="29"></rect>
                        <rect x="554.8" y="54.3" transform="matrix(7.824184e-02 -0.9969 0.9969 7.824184e-02 455.2399 630.0529)" class="house" width="27" height="29"></rect>
                        <rect x="599.9" y="109.9" transform="matrix(-4.383713e-02 -0.999 0.999 -4.383713e-02 516.0108 742.6603)" class="house" width="27" height="29"></rect>
                        <rect x="590.5" y="61" transform="matrix(7.824184e-02 -0.9969 0.9969 7.824184e-02 488.3234 679.2249)" class="house" width="42" height="29"></rect>
                        <rect x="523.3" y="7.6" transform="matrix(0.9987 -5.017447e-02 5.017447e-02 0.9987 -0.4324 26.9601)" class="house" width="27" height="29"></rect>
                        <rect x="559.4" y="13" transform="matrix(0.9974 7.191537e-02 -7.191537e-02 0.9974 3.4622 -41.1289)" class="house" width="27" height="29"></rect>
                        <rect x="441.2" y="9.1" transform="matrix(0.9987 -5.017447e-02 5.017447e-02 0.9987 -0.6115 22.8455)" class="house" width="27" height="29"></rect>
                        <rect x="482.5" y="9.5" transform="matrix(0.9974 7.191537e-02 -7.191537e-02 0.9974 3.01 -35.6087)" class="house" width="27" height="29"></rect>
                        <rect x="506.5" y="57.9" transform="matrix(-5.119640e-02 0.9987 -0.9987 -5.119640e-02 627.7789 -451.6839)" class="house" width="44" height="29"></rect>
                        <rect x="473" y="51.2" transform="matrix(-0.9855 -0.1694 0.1694 -0.9855 954.8387 212.8199)" class="house" width="27" height="29"></rect>
                        <rect x="420.2" y="74.1" transform="matrix(0.8365 -0.548 0.548 0.8365 22.366 252.1608)" class="house" width="27" height="29"></rect>
                        <rect x="361" y="20.9" transform="matrix(-0.5066 0.8622 -0.8622 -0.5066 599.1471 -261.7045)" class="house" width="27" height="39.3"></rect>
                        <rect x="389.6" y="8.7" transform="matrix(0.988 0.1544 -0.1544 0.988 7.8731 -63.0051)" class="house" width="40" height="21"></rect>
                        <rect x="326.7" y="7.4" transform="matrix(5.195598e-02 -0.9986 0.9986 5.195598e-02 303.5975 354.5896)" class="house" width="23.7" height="20"></rect>
                        <rect x="120" y="280.6" transform="matrix(-0.9578 -0.2875 0.2875 -0.9578 174.1191 632.1168)" class="house" width="27" height="45.3"></rect>
                        <rect x="90.5" y="252.9" transform="matrix(-0.9186 -0.3953 0.3953 -0.9186 93.8105 554.0711)" class="house" width="27" height="29"></rect>
                        <rect x="51.2" y="244.4" transform="matrix(-0.938 -0.3467 0.3467 -0.938 35.6634 524.2684)" class="house" width="27" height="29"></rect>
                        <rect x="10.7" y="243.4" transform="matrix(-0.9633 -0.2686 0.2686 -0.9633 -20.7961 506.3782)" class="house" width="27" height="22.4"></rect>
                        <rect x="11.9" y="281" transform="matrix(-0.9819 -0.1893 0.1893 -0.9819 19.7394 597.7904)" class="house" width="53" height="34"></rect>
                        <rect x="111.2" y="363.1" transform="matrix(0.9996 2.752377e-02 -2.752377e-02 0.9996 10.4398 -3.2902)" class="house" width="27" height="29"></rect>
                        <rect x="69.1" y="362.3" transform="matrix(0.9999 -1.595350e-02 1.595350e-02 0.9999 -6.0005 1.3651)" class="house" width="27" height="29"></rect>
                        <rect x="14.3" y="368.6" transform="matrix(0.9999 -1.671966e-02 1.671966e-02 0.9999 -6.334 0.6263)" class="house" width="40" height="21"></rect>
                        <rect x="9.8" y="327" transform="matrix(-0.998 6.254156e-02 -6.254156e-02 -0.998 67.9205 680.7963)" class="house" width="27" height="29"></rect>
                        <rect x="45.9" y="332.7" transform="matrix(0.9987 -5.083895e-02 5.083895e-02 0.9987 -17.3539 3.7063)" class="house" width="36.5" height="20.5"></rect>
                        <rect x="95.9" y="335.7" transform="matrix(0.9975 7.094710e-02 -7.094710e-02 0.9975 24.8342 -7.2288)" class="house" width="36.5" height="20.5"></rect>
                        <rect x="11.1" y="204.6" transform="matrix(-0.9941 -0.1088 0.1088 -0.9941 22.6024 439.5287)" class="house" width="24.4" height="29.1"></rect>
                        <rect x="188.4" y="359.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -37.9884 23.1575)" class="house" width="27" height="29"></rect>
                        <rect x="226.6" y="369.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 13.4187 -8.3754)" class="house" width="40" height="21"></rect>
                        <rect x="150.3" y="361.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -13.0229 5.9456)" class="house" width="27" height="29"></rect>
                        <rect x="151" y="324" transform="matrix(0.9976 -6.975646e-02 6.975646e-02 0.9976 -23.1432 12.3005)" class="house" width="27" height="27"></rect>
                        <rect x="160.2" y="284.7" transform="matrix(0.9688 0.248 -0.248 0.9688 79.6174 -33.7344)" class="house" width="27" height="29"></rect>
                        <rect x="143" y="227.6" transform="matrix(-0.6993 0.7148 -0.7148 -0.6993 444.8062 313.4397)" class="house" width="27" height="45.3"></rect>
                        <rect x="101.5" y="204.9" transform="matrix(-0.9447 -0.3279 0.3279 -0.9447 151.6831 464.3162)" class="house" width="27" height="29"></rect>
                        <rect x="235.5" y="313.2" transform="matrix(-0.9402 -0.3406 0.3406 -0.9402 371.5643 720.6547)" class="house" width="27" height="29"></rect>
                        <rect x="199.1" y="292.8" transform="matrix(-0.807 -0.5906 0.5906 -0.807 202.6941 680.7924)" class="house" width="27" height="29"></rect>
                    </g>

                    <g v-if="ActiveMap === 'Map4'">
                        <rect x="87.4" y="89.1" transform="matrix(0.9904 -0.1379 0.1379 0.9904 -13.3275 14.9082)" class="house" width="27" height="29"></rect>
                        <rect x="10.7" y="113.1" transform="matrix(0.9999 -1.658851e-02 1.658851e-02 0.9999 -2.2625 0.3951)" class="house" width="24" height="47"></rect>
                        <rect x="11.2" y="169.9" transform="matrix(0.9974 -7.219342e-02 7.219342e-02 0.9974 -13.2459 2.2634)" class="house" width="27" height="29"></rect>
                        <rect x="49.7" y="93.6" transform="matrix(0.9993 -3.734102e-02 3.734102e-02 0.9993 -3.9923 2.434)" class="house" width="27" height="29"></rect>
                        <rect x="174.6" y="11.4" transform="matrix(0.9988 4.989597e-02 -4.989597e-02 0.9988 1.9036 -9.3444)" class="house" width="27" height="44"></rect>
                        <rect x="53" y="51.1" transform="matrix(0.9974 -7.219342e-02 7.219342e-02 0.9974 -4.5615 4.9755)" class="house" width="27" height="29"></rect>
                        <rect x="93.3" y="47.7" transform="matrix(0.9988 4.989604e-02 -4.989604e-02 0.9988 3.2342 -5.2508)" class="house" width="27" height="29"></rect>
                        <rect x="1.9" y="58.1" transform="matrix(-1.298276e-02 0.9999 -0.9999 -1.298276e-02 96.7446 49.6819)" class="house" width="44" height="29"></rect>
                        <rect x="115.7" y="8.7" transform="matrix(0.9995 3.245791e-02 -3.245791e-02 0.9995 0.6205 -4.507)" class="house" width="46.9" height="16.3"></rect>
                        <rect x="58.3" y="9.3" transform="matrix(0.9993 -3.734116e-02 3.734116e-02 0.9993 -0.8345 2.9503)" class="house" width="40.6" height="29"></rect>
                        <rect x="14.2" y="8.8" transform="matrix(0.9988 4.989604e-02 -4.989604e-02 0.9988 1.1993 -1.3528)" class="house" width="27" height="29"></rect>
                        <rect x="106.5" y="169.9" transform="matrix(0.995 -0.1003 0.1003 0.995 -17.8797 13.1156)" class="house" width="30" height="29"></rect>
                        <rect x="53" y="170" transform="matrix(-0.9992 -3.986819e-02 3.986819e-02 -0.9992 138.5436 371.6742)" class="house" width="40" height="29"></rect>
                        <rect x="122.3" y="83.4" transform="matrix(-0.1013 0.9949 -0.9949 -0.1013 253.4618 -33.1518)" class="house" width="38.7" height="29"></rect>
                        <rect x="95.4" y="130.6" class="house" width="45" height="29"></rect>
                        <rect x="169.7" y="68.8" transform="matrix(0.1548 0.9879 -0.9879 0.1548 234.4961 -112.3035)" class="house" width="26.4" height="24.1"></rect>
                        <rect x="306.9" y="47" transform="matrix(0.9976 -6.975646e-02 6.975646e-02 0.9976 -3.4071 22.4944)" class="house" width="27" height="26"></rect>
                        <rect x="219" y="53" transform="matrix(0.9976 -6.975647e-02 6.975647e-02 0.9976 -4.1439 16.3814)" class="house" width="27" height="29"></rect>
                        <rect x="350.4" y="39.2" transform="matrix(0.9842 0.1771 -0.1771 0.9842 15.7511 -64.9454)" class="house" width="42.8" height="33.1"></rect>
                        <rect x="350.1" y="9.1" transform="matrix(-0.9999 1.574466e-02 -1.574466e-02 -0.9999 767.4531 36.0669)" class="house" width="67" height="24"></rect>
                        <rect x="433.1" y="8.3" transform="matrix(-0.9968 8.043618e-02 -8.043618e-02 -0.9968 919.9733 0.4758)" class="house" width="53.8" height="21"></rect>
                        <rect x="212.4" y="12" transform="matrix(8.689240e-02 0.9962 -0.9962 8.689240e-02 234.8196 -203.2688)" class="house" width="31.9" height="29"></rect>
                        <rect x="294.8" y="9.2" transform="matrix(0.9995 3.025540e-02 -3.025540e-02 0.9995 0.8613 -9.5742)" class="house" width="44" height="29"></rect>
                        <rect x="258.3" y="15.7" transform="matrix(0.9933 -0.1155 0.1155 0.9933 -2.5709 31.6387)" class="house" width="27" height="44.6"></rect>
                        <rect x="569.1" y="203.7" transform="matrix(-0.9989 -4.609897e-02 4.609897e-02 -0.9989 1154.5146 462.9984)" class="house" width="27" height="29"></rect>
                        <rect x="487.9" y="280.6" transform="matrix(0.9578 -0.2875 0.2875 0.9578 -65.8761 157.9223)" class="house" width="33.6" height="45.3"></rect>
                        <rect x="523.8" y="253.9" transform="matrix(0.9186 -0.3953 0.3953 0.9186 -62.3213 234.2484)" class="house" width="27" height="29"></rect>
                        <rect x="603.6" y="244.4" transform="matrix(0.9633 -0.2686 0.2686 0.9633 -45.9768 175.1111)" class="house" width="27" height="22.4"></rect>
                        <rect x="576.4" y="282" transform="matrix(0.9819 -0.1893 0.1893 0.9819 -45.6866 119.5198)" class="house" width="53" height="34"></rect>
                        <rect x="503.1" y="364.1" transform="matrix(-0.9996 2.752377e-02 -2.752377e-02 -0.9996 1043.3885 742.808)" class="house" width="27" height="29"></rect>
                        <rect x="545.3" y="363.3" transform="matrix(-0.9999 -1.595349e-02 1.595349e-02 -0.9999 1111.4172 764.4278)" class="house" width="27" height="29"></rect>
                        <rect x="587" y="369.6" transform="matrix(-0.9999 -1.671967e-02 1.671967e-02 -0.9999 1207.6232 770.3384)" class="house" width="40" height="21"></rect>
                        <rect x="604.5" y="328" transform="matrix(0.998 6.254152e-02 -6.254152e-02 0.998 22.6279 -37.9811)" class="house" width="27" height="29"></rect>
                        <rect x="537.6" y="292.8" transform="matrix(0.2818 0.9595 -0.9595 0.2818 690.6188 -308.0258)" class="house" width="27" height="29"></rect>
                        <rect x="492.9" y="335.2" transform="matrix(-0.9975 7.094727e-02 -7.094727e-02 -0.9975 1057.4727 653.2589)" class="house" width="48.5" height="20.5"></rect>
                        <rect x="605.8" y="205.6" transform="matrix(0.9941 -0.1088 0.1088 0.9941 -20.2906 68.5786)" class="house" width="24.4" height="29.1"></rect>
                        <rect x="467.5" y="231" transform="matrix(0.6157 0.788 -0.788 0.6157 388.9576 -279.5303)" class="house" width="27" height="55.9"></rect>
                        <rect x="516.6" y="210.3" transform="matrix(0.9723 -0.2336 0.2336 0.9723 -37.6509 131.6387)" class="house" width="40.6" height="29"></rect>
                        <rect x="233.4" y="326.8" transform="matrix(-0.9957 -9.238441e-02 9.238441e-02 -0.9957 463.9899 707.2789)" class="house" width="30" height="32.2"></rect>
                        <rect x="267.9" y="347" transform="matrix(-4.292354e-02 -0.9991 0.9991 -4.292354e-02 -56.5652 673.7181)" class="house" width="53" height="34"></rect>
                        <rect x="112.2" y="362.1" transform="matrix(0.9996 2.752377e-02 -2.752377e-02 0.9996 10.4127 -3.3181)" class="house" width="27" height="29"></rect>
                        <rect x="70.1" y="361.3" transform="matrix(0.9999 -1.595350e-02 1.595350e-02 0.9999 -5.9844 1.3809)" class="house" width="27" height="29"></rect>
                        <rect x="15.3" y="367.6" transform="matrix(0.9999 -1.671966e-02 1.671966e-02 0.9999 -6.3171 0.6428)" class="house" width="40" height="21"></rect>
                        <rect x="11.1" y="338.9" transform="matrix(-0.998 6.254156e-02 -6.254156e-02 -0.998 71.0097 693.6567)" class="house" width="27" height="18"></rect>
                        <rect x="274.7" y="297.8" transform="matrix(2.750296e-02 0.9996 -0.9996 2.750296e-02 592.5248 15.597)" class="house" width="27" height="29"></rect>
                        <rect x="46.9" y="335.7" transform="matrix(0.9987 -5.083895e-02 5.083895e-02 0.9987 -17.5051 3.761)" class="house" width="36.5" height="20.5"></rect>
                        <rect x="118.9" y="326.7" transform="matrix(-1.014708e-02 0.9999 -0.9999 -1.014708e-02 473.4945 205.2501)" class="house" width="32.5" height="20.5"></rect>
                        <rect x="189.4" y="362.5" transform="matrix(0.9945 -0.1045 0.1045 0.9945 -38.2965 23.2785)" class="house" width="27" height="29"></rect>
                        <rect x="227.6" y="368.7" transform="matrix(0.9994 3.489950e-02 -3.489950e-02 0.9994 13.3844 -8.4109)" class="house" width="40" height="21"></rect>
                        <rect x="151.3" y="360.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -12.9874 5.9799)" class="house" width="27" height="29"></rect>
                        <rect x="153.7" y="312.1" transform="matrix(0.9976 -6.975652e-02 6.975652e-02 0.9976 -22.6853 12.4673)" class="house" width="27" height="38"></rect>
                        <rect x="226.5" y="289.2" transform="matrix(-0.1287 -0.9917 0.9917 -0.1287 -30.2606 580.8317)" class="house" width="27" height="29"></rect>
                        <rect x="190.1" y="297.8" transform="matrix(-0.9643 0.2647 -0.2647 -0.9643 482.5975 559.5117)" class="house" width="27" height="29"></rect>
                        <rect x="439.9" y="47.5" transform="matrix(3.783475e-02 -0.9993 0.9993 3.783475e-02 381.9779 520.6744)" class="house" width="43" height="29"></rect>
                        <rect x="583.6" y="30.1" transform="matrix(-6.838313e-02 -0.9977 0.9977 -6.838313e-02 617.2484 660.6304)" class="house" width="67" height="24"></rect>
                        <rect x="497.5" y="7.2" transform="matrix(1.376585e-03 -1 1 1.376585e-03 488.5335 532.6677)" class="house" width="27" height="29"></rect>
                        <rect x="536.7" y="12.3" transform="matrix(0.9986 -5.211059e-02 5.211059e-02 0.9986 -0.7639 29.3877)" class="house" width="53" height="34"></rect>
                        <rect x="565.1" y="58.1" transform="matrix(5.371067e-02 -0.9986 0.9986 5.371067e-02 475.0117 646.4506)" class="house" width="27" height="29"></rect>
                        <rect x="483.9" y="48" transform="matrix(-0.2142 0.9768 -0.9768 -0.2142 669.2632 -413.355)" class="house" width="33.9" height="29"></rect>
                        <rect x="411.1" y="44" transform="matrix(0.9975 -7.010388e-02 7.010388e-02 0.9975 -2.9156 29.6975)" class="house" width="21" height="24.8"></rect>
                        <rect x="230.4" y="139.2" transform="matrix(0.9838 -0.1795 0.1795 0.9838 -23.8783 47.7365)" class="house" width="42.8" height="33.1"></rect>
                        <rect x="343.9" y="195.6" transform="matrix(-0.1943 0.9809 -0.9809 -0.1943 644.8257 -93.1676)" class="house" width="33.6" height="45.3"></rect>
                        <rect x="365.1" y="137.4" transform="matrix(0.9969 7.912798e-02 -7.912798e-02 0.9969 13.2102 -29.4813)" class="house" width="27" height="29"></rect>
                        <rect x="325.1" y="133.4" transform="matrix(0.9969 -7.915360e-02 7.915360e-02 0.9969 -10.648 27.2655)" class="house" width="27" height="29"></rect>
                        <rect x="294" y="197" transform="matrix(0.9978 6.692636e-02 -6.692636e-02 0.9978 14.8459 -20.1042)" class="house" width="27" height="29"></rect>
                        <rect x="197" y="168" transform="matrix(0.9867 0.1627 -0.1627 0.9867 32.4922 -31.8055)" class="house" width="27" height="29"></rect>
                        <rect x="193" y="210" transform="matrix(0.9852 -0.1715 0.1715 0.9852 -35.4558 38.7496)" class="house" width="27" height="29"></rect>
                        <rect x="231" y="204.2" transform="matrix(0.9987 -5.176292e-02 5.176292e-02 0.9987 -10.9937 12.819)" class="house" width="22" height="29"></rect>
                        <rect x="444.9" y="216.9" transform="matrix(0.9985 5.387586e-02 -5.387586e-02 0.9985 13.0252 -24.3659)" class="house" width="27" height="25.1"></rect>
                        <rect x="312.9" y="304.1" transform="matrix(-1.298276e-02 0.9999 -0.9999 -1.298276e-02 657.7615 -12.0982)" class="house" width="44" height="29"></rect>
                        <rect x="325.5" y="362.2" transform="matrix(1.305777e-02 -0.9999 0.9999 1.305777e-02 -42.0613 710.806)" class="house" width="27" height="29"></rect>
                        <rect x="14" y="248.6" transform="matrix(-0.9952 9.744098e-02 -9.744098e-02 -0.9952 106.5374 524.0558)" class="house" width="53" height="32"></rect>
                        <rect x="11.2" y="210" transform="matrix(0.9998 -2.087607e-02 2.087607e-02 0.9998 -4.6807 0.7101)" class="house" width="41" height="29"></rect>
                        <rect x="110.2" y="212.9" transform="matrix(0.9997 2.507344e-02 -2.507344e-02 0.9997 5.7398 -3.0298)" class="house" width="27" height="29"></rect>
                        <rect x="64.1" y="209.4" transform="matrix(-0.9998 2.087719e-02 -2.087719e-02 -0.9998 155.8876 446.1299)" class="house" width="22.9" height="29"></rect>
                        <rect x="360.2" y="306" transform="matrix(0.989 0.1478 -0.1478 0.989 51.5754 -52.7585)" class="house" width="41" height="29"></rect>
                        <rect x="404.3" y="362.5" transform="matrix(0.9994 -3.489950e-02 3.489950e-02 0.9994 -12.9031 14.8107)" class="house" width="27" height="29"></rect>
                        <rect x="364.9" y="366.7" transform="matrix(-0.9982 -6.020970e-02 6.020970e-02 -0.9982 738.9271 776.2296)" class="house" width="32.5" height="20.5"></rect>
                        <rect x="455.2" y="152.4" transform="matrix(0.1537 -0.9881 0.9881 0.1537 234.181 607.1827)" class="house" width="32.7" height="29"></rect>
                        <rect x="477.1" y="193.7" transform="matrix(-0.9899 0.1418 -0.1418 -0.9899 1005.7503 344.7236)" class="house" width="27" height="29"></rect>
                        <rect x="601.4" y="145.1" transform="matrix(0.9995 3.198734e-02 -3.198734e-02 0.9995 5.7524 -19.5836)" class="house" width="27" height="49.9"></rect>
                        <rect x="540.9" y="147.2" transform="matrix(-0.9975 7.094727e-02 -7.094727e-02 -0.9975 1140.0135 274.3271)" class="house" width="48.5" height="20.5"></rect>
                        <rect x="512.1" y="172.7" transform="matrix(-0.9473 0.3204 -0.3204 -0.9473 1083.4586 196.0972)" class="house" width="27" height="29"></rect>
                    </g>

                    <path class="water" :d="WaterPaths[ActiveMap]"></path>
                    <path v-for="(bridge, key) in Bridges" :class="[ 'bridge', ValidBridges.includes(key) ? 'green' : '', ErrorOccured ? 'red' : '' ]" :d="bridge"></path>
                </svg>

                <div id="Canvas"></div>

            </div>

        </div>

        <div id="story">
            
            <p>درمورد شهر کونیگسبرگ فرقی نمی‌کنه چقدر تلاش کنیم، در نهایت متوجه می‌شیم که <b>نمی‌تونیم</b>, به‌لحاظ ریاضی ممکن نیست مگه اینکه کلک بزنیم و به جای استفاده از پل شنا کنیم برگردیم تا کمر ریاضی شکسته بشه، ولی درمورد بقیه شهر ها احتمالا بتونیم، می‌تونید شهر های دیگه رو هم امتحان کنید</p>

            <p>اویلر برخلاف ما، به‌جای اینکه بشینه نقاشی بکشه و خط‌خطی کنه، با کمی تفکر تونست قاعده‌ای رو برای حل این معما پیدا کنه که به‌شکل زیر هست</p>

            <div id="konigsberg-story-graph-section">

                <p>در ابتدا شهر رو به‌صورت گراف ترسیم می‌کنیم، گرافی که در اون بخش های مختلف شهر رو به‌عنوان راس(Vertex) و پل‌ها را به‌عنوان یال(Edge) در نظر می‌گیریم و نتیجه گرافی به‌شکل مقابل می‌شه :</p>

                <svg style="height: auto;width: 100%;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 400" version="1.0"><use xlink:href="#a" width="500" height="400" transform="matrix(1 0 0 -1.0049 0 403.783)"/><path d="M35 201.62h434" style="fill:none;fill-opacity:.75;fill-rule:evenodd;stroke:var(--text-color);stroke-width:6.25;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path id="a" d="M462 192 261 33s-33-9-90-9S63 37 51 90 35 198 35 198s60.936-14.038 121-57c68.03-48.66 93-99 93-99" style="fill:none;fill-opacity:.75;fill-rule:evenodd;stroke:var(--text-color);stroke-width:6.25;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path id="b" d="M58 200a23 23 0 1 1-46 0 23 23 0 1 1 46 0z" style="fill:#E57373;fill-opacity:1;fill-rule:evenodd;stroke:#B71C1C;stroke-width:3.75;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" transform="translate(0 1.5)"/><use xlink:href="#b" width="500" height="400" transform="translate(432)"/><use xlink:href="#b" width="500" height="400" transform="translate(219.5 -168)"/><use xlink:href="#b" width="500" height="400" transform="translate(219.5 171)"/></svg>

            </div>

            <p>با انجام اینکار، معمای به این قشنگی رو تبدیل کردیم به یک مسئله امتحانی ریاضی که باید بشینیم حفظ کنیم، معمای شهر کونیگسبرگ قابل حل نیست چون چهار راس از درجه فرد داریم، پس دور اویلر و مسیر اویلر وجود نداره</p>

        </div>

    </section>

    <Footer />
</template>

<style lang="scss">

    #container-bridges {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

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

    #container-bridges-frame {
        display: flex;
        flex-direction: column;

        > ul {
            display: flex;
            justify-content: center;
            gap: 12px;
            align-items: center;
            width: 100%;

            > li {
                background: var(--bg-card);
                box-shadow: var(--shadow-card);
                padding: 6px 12px;
                user-select: none;
                cursor: pointer;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                opacity: 0.625;

                &.active {
                    opacity: 1;
                }

                > i {
                    padding-left: 6px;

                    &.icon-x-circle {
                        color: var(--bridge-bridge-red);
                    }


                    &.icon-check-circle {
                        color: var(--bridge-bridge-green);
                    }
                }
            }
        }

        > div {
            background-color: var(--bg-card);
            border-radius: 12px;
            box-shadow: var(--shadow-card);
            border: 12px solid var(--bridge-water);
            line-height: 0;
        }

    }

    .house {
        fill: var(--bridge-house);
    }

    .bridge {
        fill: var(--bridge-bridge);
        transition: fill .2s;
    }

    .bridge.green {
        fill: var(--bridge-bridge-green);
    }

    .bridge.red {
        fill: var(--bridge-bridge-red);
    }

    .water {
        fill: var(--bridge-water);
    }

    #Canvas svg path {
        stroke: var(--draw-color) !important;
    }

    #konigsberg-story-graph-section {
        display: grid;
        grid-template-columns: 4fr 1fr;
        grid-gap: 24px;
    }
</style>