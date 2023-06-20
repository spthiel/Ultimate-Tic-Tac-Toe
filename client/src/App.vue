<script>
import {ref} from "vue";

export default {
    setup() {
        const blue = ref(localStorage.getItem("blue") || "#0a1f70");
        const red = ref(localStorage.getItem("red") || "#ff6985");
        const black = ref(localStorage.getItem("black") || "#000000");
        const white = ref(localStorage.getItem("white") || "#ffffff");

        document.body.style.background = white.value;

        return {
            blue,
            red,
            black,
            white
        }
    },
    watch: {
        blue() {
            localStorage.setItem("blue", this.blue);
        },
        red() {
            localStorage.setItem("red", this.red);
        },
        black() {
            localStorage.setItem("black", this.black);
        },
        white() {
            document.body.style.background = this.white;
            localStorage.setItem("white", this.white);
        }
    }
}
</script>

<template>
    <div id="colorroot">
        <header class="bg-[var(--blue)] text-[var(--white)] p-4 text-2xl">
            <div class="flex justify-between">
                <nav>
                    <RouterLink to="/">Home</RouterLink>
                </nav>
                <div>
                    <span>Theme:</span>
                    <input class="bg-transparent w-7" title="Color of blue player" type="color" v-model="blue">
                    <input class="bg-transparent w-7" title="Color of red player" type="color" v-model="red">
                    <input class="bg-transparent w-7" title="Foreground color" type="color" v-model="black">
                    <input class="bg-transparent w-7" title="Background color" type="color" v-model="white">
                </div>
            </div>
        </header>

        <div class="flex justify-center mt-4">
            <div>
                <RouterView/>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
header {
    line-height: 1.5;
    max-height: 100vh;
}
</style>

<style>
#colorroot {
    --red: v-bind('red');
    --blue: v-bind('blue');
    --black: v-bind('black');
    --white: v-bind('white');
}
</style>

<style>
body {
    background: v-bind('white');
}
</style>