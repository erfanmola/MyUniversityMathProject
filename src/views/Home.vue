<script setup>
    import Header from '../sections/Header.vue';
    import Footer from '../sections/Footer.vue';
</script>

<template>
    <Header />

    <section id="container-home">

        <ul>

            <li>
                <routerLink to="/MapColoring">
                    <i class="icon-map"></i>
                    <h2>رنگ‌آمیزی نقشه</h2>
                </routerLink>
            </li>

            <li>
                <routerLink to="/Bridges">
                    <i class="icon-bridge"></i>
                    <h2>پل‌های کونیگسبرگ</h2>
                </routerLink>
            </li>

            <li>
                <routerLink to="/Planar">
                    <i class="icon-pipe"></i>
                    <h2>لوله‌کشی خانه‌ها</h2>
                </routerLink>
            </li>

            <li>
                <routerLink to="/Escape">
                    <i class="icon-freedom"></i>
                    <h2>مسیر آزادی</h2>
                </routerLink>
            </li>

        </ul>

    </section>

    <Footer />
</template>

<style lang="scss">

    #container-home {
        flex-grow: 1;
        display: block;
        width: 100%;
        padding: 24px 0;

        > ul {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 24px;

            > li > a {
                display: flex;
                flex-direction: column;
                background-color: var(--bg-card);
                box-shadow: var(--shadow-card);
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem 0;
                gap: 12px;
                border-radius: 12px;
                transition: background-color .15s, color .15s;

                &:hover {
                    background-color: var(--bg-card-hover);
                    color: var(--accent);
                }

                > i {
                    font-size: 5rem;
                    color: var(--accent);
                }

                > h2 {
                    font-size: 1.125rem;
                }
            }
        }

    }

</style>