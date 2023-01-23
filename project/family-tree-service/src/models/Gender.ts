import {Literal, Union} from 'runtypes';

export const Gender = Union(Literal('MALE'), Literal('FEMALE'), Literal(''), Literal('male'), Literal('female'));