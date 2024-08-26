import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Balance = number;
export type Chain = string;
export type TransactionResult = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'authenticate' : ActorMethod<[], string>,
  'getBalance' : ActorMethod<[Chain], [] | [Balance]>,
  'getTokenUtilities' : ActorMethod<[], string>,
  'initTestData' : ActorMethod<[], undefined>,
  'sendTransaction' : ActorMethod<[Chain, number, string], TransactionResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
