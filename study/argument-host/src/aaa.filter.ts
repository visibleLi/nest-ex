import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AaaException } from './AaaException';
import { Response } from 'express';
import { escape } from 'querystring';

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    console.log(exception);
    if(host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      //const request = ctx.getRequest();
      response.status(400).json({
        aaa: exception.aaa,
        bbb: exception.bbb,
      });
    }else if(host.getType() === 'rpc') {
      console.log('rpc');
    } else {  
      console.log('ws');
     }
  } 
}
