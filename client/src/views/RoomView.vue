<script lang="ts">
import Board from "@/components/Board.vue";
import {useRoute, useRouter} from "vue-router";
import type {Ref} from "vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {socket} from "@/socket";
import type {Join, PlaceResult, Result, SuccessJoin, WinResult} from '../../../server/src/interfaces';
import Player from "../../../server/src/game/Player";

export default {
    computed: {
        Player() {
            return Player
        }
    },
    components: {
        Board
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const state: Ref<number[][]> = ref(Array(9).fill(Array(9).fill(Player.NONE)));
        const boards: Ref<number[]> = ref(Array(9).fill(Player.NONE));
        const color: Ref<Player> = ref(Player.NONE);
        const currentColor: Ref<Player> = ref(Player.NONE);
        const whoWon: Ref<Player> = ref(Player.NONE);

        onMounted(() => {
            console.log(socket.connect());
            socket.emit("join", route.params.room);
        });

        onBeforeUnmount(() => {
            socket.disconnect();
        })

        function isSuccessJoin(response: Join): response is SuccessJoin {
            return response.status === "success";
        }

        socket.on("join", (response: Join) => {
            if (!isSuccessJoin(response)) {
                router.push("/");
                return;
            }

            let {
                color: ownColor,
                board,
                room,
                boards: resBoards,
                next: {
                    player: nextPlayer,
                    board: nextBoard
                }
            } = response

            if (nextPlayer === ownColor) {
                if (nextBoard) {
                    resBoards[nextBoard.x + nextBoard.y * 3] = -1;
                } else {
                    resBoards = resBoards.map(v => v || -1);
                }
            }

            router.replace("/" + room);
            state.value = board;
            boards.value = resBoards;
            currentColor.value = nextPlayer;
            color.value = ownColor;
        });

        function isPlaceResult(result: WinResult): result is Result {
            return result.hasOwnProperty("nextColor");
        }

        socket.on("place", (response: PlaceResult) => {
            if (!response) {
                return;
            }

            const {win, placed: {x, y, placed}} = response;

            let translatedX = y % 3 * 3 + x % 3;
            let translatedY = Math.floor(y / 3) * 3 + Math.floor(x / 3);

            if (isPlaceResult(response)) {
                const {nextBoard, nextColor} = response;

                let translatedX = y % 3 * 3 + x % 3;
                let translatedY = Math.floor(y / 3) * 3 + Math.floor(x / 3);

                let tmp = boards.value;
                tmp[translatedY] = win;
                tmp = tmp.map((v :number) => v === -1 ? 0 : v);
                if (nextColor === color.value) {
                    if (nextBoard) {
                        tmp[nextBoard.x + nextBoard.y * 3] = -1;
                    } else {
                        tmp = tmp.map((v: number) => v || -1);
                    }
                }

                currentColor.value = nextColor;
                state.value[translatedY][translatedX] = placed;
                boards.value = tmp;
            } else {

                let tmp = boards.value;
                tmp[translatedY] = win;
                tmp = tmp.map(v => v === -1 ? 0 : v);
                currentColor.value = Player.NONE;

                whoWon.value = win;
                state.value[translatedY][translatedX] = placed;
                boards.value = tmp;
            }

        });

        return {
            state,
            boards,
            color,
            currentColor,
            whoWon
        }
    },
    methods: {
        place(boardX: number, boardY: number) {
            return (cellX: number, cellY: number) => {
                socket.emit("place", {x: boardX * 3 + cellX, y: boardY * 3 + cellY})
            }
        }
    },
}

</script>

<template>
    <template v-if="whoWon === Player.NONE">
        <div class="flex justify-center gap-1 items-center">
            <h2 class="text-[var(--black)] text-center">It's <span :class="{
                'text-[var(--red)]': currentColor === Player.RED,
                'text-[var(--blue)]': currentColor === Player.BLUE
            }">{{ color === currentColor ? "your" : "your opponents" }}</span> turn. You're playing</h2>
            <div class="w-5 rounded-sm aspect-square" :class="{
                'bg-[var(--red)]': color === Player.RED,
                'bg-[var(--blue)]': color === Player.BLUE,
            }"></div>
        </div>
    </template>
    <template v-else-if="whoWon === Player.DRAW">
        <h2 class="text-center text-[var(--black)]">It's a draw!</h2>
    </template>
    <template v-else>
        <h2 class="text-center" :class="{
            'text-[var(--red)]': whoWon === Player.RED,
            'text-[var(--blue)]': whoWon === Player.BLUE
        }">{{ whoWon === color ? "You" : "Your opponent"}} won!</h2>
    </template>
    <Board :state="state" :place="place" :boards="boards"/>
</template>

<style>
</style>
