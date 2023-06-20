<script setup lang="ts">
import {ref} from "vue";
import Player from "../../../server/src/game/Player";

defineProps<{
    states: number[],
    place: (x: number, y: number) => void,
    color: number
}>()

</script>

<template>
    <div class="relative">
        <template v-for="y in [0,1,2]">
            <div class="flex">
                <template v-for="x in [0,1,2]">
                    <div class="border-[var(--black)] p-1" :class="{
                        'border-r-2': x < 2,
                        'border-b-2': y < 2
                    }">
                        <div class="rounded-sm aspect-square w-8" :class="{
                            'bg-[var(--red)]': states?.[x + y*3] === Player.RED,
                            'bg-[var(--blue)]': states?.[x + y*3] === Player.BLUE,
                        }" @click="place(x,y)"></div>
                    </div>
                </template>
            </div>
        </template>
        <div class="inset-0 absolute opacity-40 rounded-sm pointer-events-none transition-all duration-500" :class="{
                            'bg-[var(--red)]': color === Player.RED,
                            'bg-[var(--blue)]': color === Player.BLUE,
                            'bg-[var(--black)] pulse': color === 3
                }"></div>
    </div>
</template>