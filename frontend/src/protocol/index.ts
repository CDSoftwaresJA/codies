import myzod, { Infer } from 'myzod';
import { DeepReadonly } from 'ts-essentials';

// See protocol.go.

// Messages sent from client to server.

export type WordPack = Infer<typeof WordPack>;
const WordPack = myzod.object({
    name: myzod.string(),
    words: myzod.array(myzod.string()),
});

export type PartialClientNote = Infer<typeof PartialClientNote>;
export type PartialClientNoteSender = (r: PartialClientNote) => void;
const PartialClientNote = myzod.union([
    myzod.object({
        method: myzod.literal('newGame'),
        params: myzod.object({}),
    }),
    myzod.object({
        method: myzod.literal('endTurn'),
        params: myzod.object({}),
    }),
    myzod.object({
        method: myzod.literal('randomizeTeams'),
        params: myzod.object({}),
    }),
    myzod.object({
        method: myzod.literal('reveal'),
        params: myzod.object({ row: myzod.number(), col: myzod.number() }),
    }),
    myzod.object({
        method: myzod.literal('changeTeam'),
        params: myzod.object({ team: myzod.number() }),
    }),
    myzod.object({
        method: myzod.literal('changeNickname'),
        params: myzod.object({ nickname: myzod.string() }),
    }),
    myzod.object({
        method: myzod.literal('changeRole'),
        params: myzod.object({ spymaster: myzod.boolean() }),
    }),
    myzod.object({
        method: myzod.literal('changePack'),
        params: myzod.object({ num: myzod.number(), enable: myzod.boolean() }),
    }),
    myzod.object({
        method: myzod.literal('changeTurnMode'),
        params: myzod.object({ timed: myzod.boolean() }),
    }),
    myzod.object({
        method: myzod.literal('changeTurnTime'),
        params: myzod.object({ seconds: myzod.number() }),
    }),
    myzod.object({
        method: myzod.literal('addPacks'),
        params: myzod.object({
            packs: myzod.array(WordPack),
        }),
    }),
    myzod.object({
        method: myzod.literal('removePack'),
        params: myzod.object({ num: myzod.number() }),
    }),
    myzod.object({
        method: myzod.literal('changeHideBomb'),
        params: myzod.object({ hideBomb: myzod.boolean() }),
    }),
]);

export type ClientNote = Infer<typeof ClientNote>;
export const ClientNote = myzod
    .object({
        version: myzod.number(),
    })
    .and(PartialClientNote);

// Messages sent from server to client.

export type RoomResponse = DeepReadonly<Infer<typeof RoomResponse>>;
export const RoomResponse = myzod.object({
    id: myzod.string().optional().nullable(),
    error: myzod.string().optional().nullable(),
});

export type TimeResponse = DeepReadonly<Infer<typeof TimeResponse>>;
export const TimeResponse = myzod.object({
    time: myzod.date(),
});

export type StateTile = DeepReadonly<Infer<typeof StateTile>>;
const StateTile = myzod.object({
    word: myzod.string(),
    revealed: myzod.boolean(),
    view: myzod
        .object({
            team: myzod.number(),
            neutral: myzod.boolean(),
            bomb: myzod.boolean(),
        })
        .optional()
        .nullable(),
});

export type StateBoard = DeepReadonly<Infer<typeof StateBoard>>;
const StateBoard = myzod.array(myzod.array(StateTile));

export type StatePlayer = DeepReadonly<Infer<typeof StatePlayer>>;
const StatePlayer = myzod.object({
    playerID: myzod.string(),
    nickname: myzod.string(),
    spymaster: myzod.boolean(),
});

export type StateTeams = DeepReadonly<Infer<typeof StateTeams>>;
const StateTeams = myzod.array(myzod.array(StatePlayer));

export type StateTimer = DeepReadonly<Infer<typeof StateTimer>>;
const StateTimer = myzod.object({
    turnTime: myzod.number(),
    turnEnd: myzod.date(),
});

export type StateWordList = DeepReadonly<Infer<typeof StateWordList>>;
const StateWordList = myzod.object({
    name: myzod.string(),
    count: myzod.number(),
    custom: myzod.boolean(),
    enabled: myzod.boolean(),
});

export type RoomState = DeepReadonly<Infer<typeof RoomState>>;
export const RoomState = myzod.object({
    version: myzod.number(),
    teams: StateTeams,
    turn: myzod.number(),
    winner: myzod.number().optional().nullable(),
    board: StateBoard,
    wordsLeft: myzod.array(myzod.number()),
    lists: myzod.array(StateWordList),
    timer: StateTimer.optional().nullable(),
    hideBomb: myzod.boolean(),
});

export type State = DeepReadonly<Infer<typeof State>>;
export const State = myzod.object({
    playerID: myzod.string(),
    roomState: RoomState,
});

export type ServerNote = DeepReadonly<Infer<typeof ServerNote>>;
export const ServerNote = myzod.union([
    myzod.object({
        method: myzod.literal('state'),
        params: State,
    }),
]);
