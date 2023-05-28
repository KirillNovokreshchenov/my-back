import {Request} from "express";

export type RequestWithBody<T> =Request<{},{}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithBodyAndParams<T,Y> =Request<T, {}, Y>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithQueryAndParams<T,Y> = Request<T,{},{},Y>