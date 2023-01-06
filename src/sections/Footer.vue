<template>
    <hr id="hr-footer">

    <footer id="main-footer">
        <p>طراحی و توسعه با <i class="icon-heart"></i> به برنامه‌نویسی و <i class="icon-frown"></i> به درس توسط <a href="https://ErfanMola.ir" target="_blank">عرفان مولا</a></p>
    </footer>
</template>

<style lang="scss">

    footer#main-footer {
        padding: 24px 0;

        > p {
            text-align: center;
            font-size: 1rem;
            user-select: none;

            > i.icon-heart {
                color: #F44336;
            }

            > i.icon-frown {
                color: #FF5722;
            }

            > i {
                font-size: 1.25rem;
            }

            > a {
                border-bottom: 1px solid;
                transition: opacity .15s;

                &:hover {
                    opacity: .75;
                }
            }
        }
    }

    hr#hr-footer {
        display: block;
        width: 100%;
        margin-top: 24px;
        outline: none;
        border: none;
        box-shadow: none;
        height: 2px;
        background: var(--text-color);
        opacity: 0.125;
    }

</style>