<script setup lang="ts">
import Field from "@/components/Field.vue";

defineProps<{
    state: number[][],
    boards: number[],
    place: (x: number, y: number) => (x: number, y: number) => void
}>();

</script>

<template>
    <div>
        <template v-for="y in [0,1,2]">
            <div class="flex relative">
                <template v-for="x in [0,1,2]">
                    <div class="border-[var(--black)] aspect-square p-2" :class="{
                        'border-r-4': x < 2,
                        'border-b-4': y < 2
                    }">
                        <Field :states="state[x + y*3]" :place="place(x, y)" :color="boards[x + y*3]"/>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>

</script>