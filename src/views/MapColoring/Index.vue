<script setup>
    import Header from '../../sections/Header.vue';
    import IRANMap from './IRANMap.svg';
    import { onMounted, ref, watch } from 'vue';
    import Utils from '../../utils';
    import Footer from '../../sections/Footer.vue';

    const colors = {
        "pink"   : "#EC407A",
        "green"  : "#7acd7c",
        "orange" : "#feba66",
        "salmon" : "#f3917d",
        "purple" : "#a789d9",
        "teal"   : "#66c5ca",
    };

    let activeColor = ref('pink');
    let usedColors  = ref([]);

    const provinces = {
        "alborz": [
            "mazandaran",
            "markazi",
            "qazvin",
            "tehran",
        ],
        "ardabil": [
            "azerbaijan-east",
            "zanjan",
            "gilan",
        ],
        "azerbaijan-east": [
            "azerbaijan-west",
            "zanjan",
            "ardabil",
        ],
        "azerbaijan-west": [
            "azerbaijan-east",
            "kurdistan",
            "zanjan",
        ],
        "bushehr": [
            "khuzestan",
            "kohgiluyeh-boyer-ahmad",
            "fars",
            "hormozgan",
        ],
        "chahar-mahaal-bakhtiari": [
            "khuzestan",
            "kohgiluyeh-boyer-ahmad",
            "isfahan",
        ],
        "fars": [
            "bushehr",
            "kohgiluyeh-boyer-ahmad",
            "isfahan",
            "yazd",
            "kerman",
            "hormozgan",
        ],
        "gilan": [
            "ardabil",
            "zanjan",
            "qazvin",
            "mazandaran",
        ],
        "golestan": [
            "mazandaran",
            "semnan",
            "khorasan-north",    
        ],
        "hamadan": [
            "kurdistan",
            "zanjan",
            "qazvin",
            "markazi",
            "lorestan",
            "kermanshah",
        ],
        "hormozgan": [
            "bushehr",
            "fars",
            "kerman",
            "sistan-baluchestan",
        ],
        "ilam": [
            "kermanshah",
            "lorestan",
            "khuzestan",
        ],
        "isfahan": [
            "khuzestan",
            "lorestan",
            "markazi",
            "qom",
            "semnan",
            "yazd",
            "fars",
            "kohgiluyeh-boyer-ahmad",
            "chahar-mahaal-bakhtiari",
        ],
        "kerman": [
            "hormozgan",
            "fars",
            "yazd",
            "khorasan-south",
            "sistan-baluchestan",
        ],
        "kermanshah": [
            "kurdistan",
            "hamadan",
            "lorestan",
            "ilam",
        ],
        "khorasan-north": [
            "golestan",
            "semnan",
            "khorasan-razavi",
        ],
        "khorasan-razavi": [
            "khorasan-north",
            "semnan",
            "yazd",
            "khorasan-south",
        ],
        "khorasan-south": [
            "khorasan-razavi",
            "sistan-baluchestan",
            "kerman",
            "yazd",
        ],
        "khuzestan": [
            "ilam",
            "lorestan",
            "isfahan",
            "chahar-mahaal-bakhtiari",
            "kohgiluyeh-boyer-ahmad",
            "bushehr",
        ],
        "kohgiluyeh-boyer-ahmad": [
            "khuzestan",
            "bushehr",
            "chahar-mahaal-bakhtiari",
            "isfahan",
            "fars",
        ],
        "kurdistan": [
            "kermanshah",
            "azerbaijan-west",
            "zanjan",
            "hamadan",
        ],
        "lorestan": [
            "ilam",
            "kermanshah",
            "hamadan",
            "markazi",
            "isfahan",
            "khuzestan",
        ],
        "markazi": [
            "hamadan",
            "qazvin",
            "alborz",
            "tehran",
            "qom",
            "isfahan",
            "lorestan",
        ],
        "mazandaran": [
            "gilan",
            "qazvin",
            "alborz",
            "tehran",
            "semnan",
            "golestan",
        ],
        "qazvin": [
            "zanjan",
            "gilan",
            "mazandaran",
            "alborz",
            "markazi",
            "hamadan",
        ],
        "qom": [
            "markazi",
            "tehran",
            "semnan",
            "isfahan",
        ],
        "semnan": [
            "isfahan",
            "qom",
            "tehran",
            "mazandaran",
            "golestan",
            "khorasan-north",
            "khorasan-razavi",
            "yazd",
        ],
        "sistan-baluchestan": [
            "khorasan-south",
            "hormozgan",
            "kerman",
        ],
        "tehran": [
            "qom",
            "markazi",
            "alborz",
            "mazandaran",
            "semnan",
        ],
        "yazd": [
            "isfahan",
            "semnan",
            "khorasan-razavi",
            "khorasan-south",
            "kerman",
            "fars",
        ],
        "zanjan": [
            "kurdistan",
            "azerbaijan-west",
            "azerbaijan-east",
            "ardabil",
            "gilan",
            "qazvin",
            "hamadan",
        ],
    };

    onMounted(() => {

        ResetMap();

        document.querySelector(':root').style.setProperty('--coloring-active', colors[activeColor.value]);

        const provinces_object = document.querySelectorAll('.province path');

        provinces_object.forEach(province => {
            
            province.addEventListener('click', OnProvinceClicked);
        });

    });

    const OnProvinceClicked = (e) => {

        const province = e.target.id;

        let eligible = true;

        provinces[province].forEach(city => {
            
            if (eligible && document.querySelector(`#${ city }`).classList.contains(activeColor.value)) {

                eligible = false;

            }

        });

        if (eligible) {

            document.querySelector(`#${ province }`).setAttribute('class', activeColor.value);
            document.querySelector(`#${ province }`).style.fill = colors[activeColor.value];

            usedColors.value = (Array.from(document.querySelectorAll('.province path')).map((province) => { 
                
                return Array.from(province.classList)[0]; 
            
            }).filter((value, index, self) => {

                return self.indexOf(value) === index && typeof value !== 'undefined';

            }));

        }else{

            Utils.Toast("این رنگ رو نمی‌تونیم استفاده کنیم چون برای یکی از همسایه‌ها استفاده شده :(");

        }

    };

    watch(activeColor, () => {

        document.querySelector(':root').style.setProperty('--coloring-active', colors[activeColor.value]);

    });

    const ResetMap = () => {

        activeColor.value = 'pink';
        usedColors.value = [];

        document.querySelectorAll('.province path').forEach((province) => {

            province.setAttribute('class', '');
            province.style.fill = 'var(--coloring-province)';

        });

    };
</script>

<template>
    <Header>
        <template #header>
            <li @click="ResetMap"><i class="icon-rotate-cw"></i></li>
        </template>
    </Header>
    
    <section id="container-map-coloring" class="section">
        
        <div id="story">
            <h2>رنگ‌آمیزی نقشه</h2>

            <p>
                در رنگ‌آمیزی نقشه‌ها یا هر طرح دیگری که از بخش های متمایز تشکیل شده باشد، برای تمایز بهتر بین بخش‌ها باید هیچ یک از همسایه های بخش با خود بخش رنگ یکسان نداشته باشند، همچنین باید سعی کنیم از کم‌ترین تعداد رنگ ممکن برای رنگ‌آمیزی استفاده کنیم که مخاطب را گمراه نکند، مثلا یک صفحه شطرنجی در حالت ایده‌آل می‌تواند فقط با دو رنگ سیاه و سفید رنگ‌آمیزی شود به‌طوریکه هیچ بخشی با همسایه های خود رنگ یکسان نداشته باشد،‌ شما نیز می‌توانید در کادر زیر نقشه ایران را با قاعده های مذکور رنگ‌آمیزی کنید.
            </p>
        </div>

        <ul>
            <li v-for="(color, name) in colors" :class="activeColor === name ? 'active' : ''" :style="`background-color: ${ color };`" @click="activeColor = name"></li>
        </ul>

        <p>تعداد <b>{{ usedColors.length }}</b> رنگ استفاده شده است</p>

        <div id="container-map">

            <IRANMap id="IRANMap" />

        </div>

    </section>

    <Footer />
</template>

<style lang="scss">

    #container-map-coloring {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;

        > ul {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            direction: ltr;

            > li {
                content: '';
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                cursor: pointer;
                
                &.active {
                    box-shadow:inset 0px 0px 0px 5px rgba(69,69,69,0.325);
                }
            }
        }

        > div#container-map {
            padding: 0 5%;
        }

        > p {
            text-align: center;
        }
    }

    #IRANMap {

        .border path {
            fill: var(--coloring-border);
        }

        .island path {
            fill: var(--coloring-island);
        }

        .province path {
            fill: var(--coloring-province);
        }

        .sea path, .lake path {
            fill: var(--coloring-water);
        }

    }

    @media(hover: hover) and (pointer: fine) {

        #IRANMap {

            .province path:hover {
                fill: var(--coloring-active) !important;
                cursor: pointer;
            }

        }

    }

    .section {

        #story {
            display: flex;
            flex-direction: column;
            gap: 24px;

            > h2 {
                display: block;
                text-align: center;
                font-size: 1.5rem;
            }

            > p {
                text-align: justify;
            }
        }

    }

</style>