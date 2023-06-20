<script lang="ts">
import TheWelcome from '../components/TheWelcome.vue';
import {ref} from "vue";

export default {
    setup() {

        let roomId = ref(0);

        return {
            roomId
        }
    },
    methods: {
        setRoomId(payload: Event) {
            let target = payload.target;
            if (target && target instanceof HTMLInputElement) {
                this.roomId = Number(target.value);
            }
        },
    }
}

</script>

<template>
    <main>
        <div class="flex flex-col gap-2">
            <div>
                <input @input="setRoomId" placeholder="Select room" type="number" class="border-blue-950 border-b-2 text-blue-950 px-2 pt-2 outline-0">
            </div>
            <div>
                <RouterLink :to="'/' + roomId">
                    <button class="p-2 w-full text-blue-950 border-2 border-blue-950">Join Room {{roomId}}</button>
                </RouterLink>
            </div>
            <div>
                <RouterLink to="/0">
                    <button class="p-2 w-full text-blue-950 border-2 border-blue-950">Create Room</button>
                </RouterLink>
            </div>
        </div>
    </main>
</template>

<style lang="scss">

</style>