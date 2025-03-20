import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

import { ModuleRef } from '@nestjs/core';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}


export interface OnModuleInit {
    onModuleInit(): void;
}

export interface OnApplicationBootstrap {
    onApplicationBootstrap(): void;
}

export class xxxController implements OnModuleInit, OnApplicationBootstrap{
    constructor(private ModuleRef: ModuleRef){}
    onModuleInit(){}
    onApplicationBootstrap(){}
}


export interface OnModuleDestroy {
    onModuleDestroy(): any;
}

export interface BeforeApplicationShutdown {
    beforeApplicationShutdown(signal?: string): void;
    //signal 系统信号 这些终止信号是别的进程传过来的，让它做一些销毁的事情，比如用 k8s 管理容器的时候，可以通过这个信号来通知它。
}

export interface OnApplicationShutdown {
    onApplicationShutdown(signal?: string): any;
}