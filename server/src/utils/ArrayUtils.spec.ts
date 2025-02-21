import {describe, expect, it} from "vitest";
import ArrayUtils from "./ArrayUtils";
import Player from "../game/Player";

describe("checkSingleLine", () => {
	
	const testCases = [
		{
			name: "NONE with empty array",
			input: [],
			expect: Player.NONE,
		},
		{
			name: "Blue with only blue",
			input: [Player.BLUE, Player.BLUE, Player.BLUE],
			expect: Player.BLUE
		},
		{
			name: "Red with only Red",
			input: [Player.RED, Player.RED, Player.RED],
			expect: Player.RED
		},
		{
			name: "None with empty first",
			input: [Player.NONE, Player.BLUE, Player.RED],
			expect: Player.NONE
		},
		{
			name: "None with empty last",
			input: [Player.RED, Player.BLUE, Player.NONE],
			expect: Player.NONE
		},
		{
			name: "Draw with mixed",
			input: [Player.RED, Player.BLUE, Player.RED],
			expect: Player.DRAW
		}
	]
	
	it.for(testCases)(
		"$name", (testCase => {
			const winner = ArrayUtils.checkSingleLine(testCase.input);
			expect(winner).toEqual(testCase.expect);
		})
	)
});

describe("checkLine", () => {
	const board = [
		[Player.BLUE, Player.BLUE, Player.BLUE],
		[Player.DRAW, Player.RED, Player.NONE],
		[Player.NONE, Player.NONE, Player.RED]
	];
	
	const testCases = [
		{
			x: 0,
			y: 0,
			dx: 1,
			dy: 0,
			expect: Player.BLUE
		},
		{
			x: 1,
			y: 0,
			dx: 1,
			dy: 0,
			expect: Player.BLUE
		},
		{
			x: 0,
			y: 0,
			dx: -1,
			dy: 0,
			expect: Player.BLUE
		},
		{
			x: 0,
			y: 0,
			dx: 0,
			dy: 1,
			expect: Player.DRAW
		},
		{
			x: 0,
			y: 0,
			dx: 1,
			dy: 1,
			expect: Player.DRAW
		},
		{
			x: 1,
			y: 1,
			dx: -1,
			dy: 1,
			expect: Player.NONE
		},
		{
			x: 0,
			y: 0,
			dx: -1,
			dy: 1,
			expect: false
		},
		{
			x: 1,
			y: 0,
			dx: -1,
			dy: 1,
			expect: false
		},
		{
			x: 1,
			y: 0,
			dx: 1,
			dy: 1,
			expect: false
		},
		{
			x: 2,
			y: 0,
			dx: 1,
			dy: 1,
			expect: false
		},
	]
	
	it.for(testCases)(
		"From $x,$y vector $dx,$dy to be $expect", (testCase => {
			const winner = ArrayUtils.checkLine(board, testCase.x, testCase.y, testCase.dx, testCase.dy);
			expect(winner).toEqual(testCase.expect);
		})
	)
})

describe("calculateWinningPlayer", () => {
	const board1 = [
		[Player.BLUE, Player.BLUE, Player.BLUE],
		[Player.DRAW, Player.RED, Player.NONE],
		[Player.NONE, Player.NONE, Player.RED]
	];
	
	const board2 = [
		[Player.RED, Player.BLUE, Player.BLUE],
		[Player.DRAW, Player.RED, Player.NONE],
		[Player.NONE, Player.NONE, Player.RED]
	];
	
	const board3 = [
		[Player.BLUE, Player.RED, Player.BLUE],
		[Player.DRAW, Player.RED, Player.NONE],
		[Player.NONE, Player.NONE, Player.RED]
	];
	
	const board4 = [
		[Player.NONE, Player.NONE, Player.NONE],
		[Player.NONE, Player.NONE, Player.NONE],
		[Player.RED, Player.NONE, Player.NONE]
	];
	
	const testCases = [
		{
			name: 'Board1: 0 0 equals blue',
			x: 0,
			y: 0,
			board: board1,
			expect: Player.BLUE
		},
		{
			name: 'Board1: 1 0 equals blue',
			x: 1,
			y: 0,
			board: board1,
			expect: Player.BLUE
		},
		{
			name: 'Board2: 0 0 equals red',
			x: 0,
			y: 0,
			board: board2,
			expect: Player.RED
		},
		{
			name: 'Board2: 1 1 equals red',
			x: 1,
			y: 1,
			board: board2,
			expect: Player.RED
		},
		{
			name: 'Board3: 0 0 equals draw',
			x: 0,
			y: 0,
			board: board3,
			expect: Player.DRAW
		},
		{
			name: 'Board3: 2 2 equals none',
			x: 2,
			y: 2,
			board: board3,
			expect: Player.NONE
		},
		{
			name: 'Board4: 0 2 equals none',
			x: 0,
			y: 2,
			board: board4,
			expect: Player.NONE
		},
	]
	
	it.for(testCases)(
		"$name", (testCase => {
			const winner = ArrayUtils.calculateWinningPlayer(testCase.board, testCase.x, testCase.y);
			expect(winner).toEqual(testCase.expect);
		})
	)
})

describe("Enhanced calculate winning player", () => {
	describe("With single cell", () => {
		const testCasesWithSingle = [];
		for (let i = 0; i < 9; i++) {
			const board = [];
			for (let j = 0; j < 3; j++) {
				const row = [Player.NONE, Player.NONE, Player.NONE];
				if (i - j * 3 < 3) {
					row[i - j * 3] = Player.RED;
				}
				board[j] = row;
			}
			for (let x = 0; x < 3; x++) {
				for (let y = 0; y < 3; y++) {
					testCasesWithSingle.push([i, x, y, board]);
				}
			}
		}
		
		it.for(testCasesWithSingle)("Single cell at %i, check x: %i, y: %i", ([, x, y, board]) => {
			const winner = ArrayUtils.calculateWinningPlayer(board, x, y);
			expect(winner).toEqual(Player.NONE);
		})
	});
	
	describe("With two cells", () => {
		const testCasesWithTwo = [];
		for (let i = 0; i < 8; i++) {
			for (let i2 = i + 1; i2 < 9; i2++) {
				const board = [];
				for (let j = 0; j < 3; j++) {
					const row = [Player.NONE, Player.NONE, Player.NONE];
					if (i - j * 3 < 3) {
						row[i - j * 3] = Player.RED;
					}
					if (i2 - j * 3 < 3) {
						row[i2 - j * 3] = Player.RED;
					}
					board[j] = row;
				}
				for (let x = 0; x < 3; x++) {
					for (let y = 0; y < 3; y++) {
						testCasesWithTwo.push([i, i2, x, y, board]);
					}
				}
			}
		}
		
		it.for(testCasesWithTwo)("Two cells at %i and %i, check x: %i, y: %i", ([, , x, y, board]) => {
			const winner = ArrayUtils.calculateWinningPlayer(board, x, y);
			expect(winner).toEqual(Player.NONE);
		})
	});
	
	describe("With two red and a blue", () => {
		const testCases = [];
		for (let i3 = 0; i3 < 9; i3++) {
			for (let i = 0; i < 8; i++) {
				if (i3 === i) {
					continue;
				}
				for (let i2 = i + 1; i2 < 9; i2++) {
					if (i3 === i2) {
						continue;
					}
					
					const board = [];
					for (let j = 0; j < 3; j++) {
						const row = [Player.NONE, Player.NONE, Player.NONE];
						if (i - j * 3 < 3) {
							row[i - j * 3] = Player.RED;
						}
						if (i2 - j * 3 < 3) {
							row[i2 - j * 3] = Player.RED;
						}
						if (i3 - j * 3 < 3) {
							row[i3 - j * 3] = Player.BLUE;
						}
						board[j] = row;
					}
					for (let x = 0; x < 3; x++) {
						for (let y = 0; y < 3; y++) {
							testCases.push([i, i2, i3, x, y, board]);
						}
					}
				}
			}
		}
		
		it.for(testCases)("Red at %i and %i and blue at %i, check x: %i, y: %i", ([, , , x, y, board]) => {
			const winner = ArrayUtils.calculateWinningPlayer(board, x, y);
			expect(winner).toEqual(Player.NONE);
		})
	});
})