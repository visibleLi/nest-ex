import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  UploadedFiles,
  Body,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log(files, 'files');
    console.log(body, 'body');

    const name = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = 'uploads/chunks_' + name;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  // @Get('merge')
  // async mergeFiles(@Query('name') name: string) {
  //   const chunkDir = 'uploads/chunks_' + name;
  //   const chunkPaths = fs.readdirSync(chunkDir);
  //   chunkPaths.sort(
  //     (a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]),
  //   );
  //   chunkPaths.forEach((chunkPath, index) => {
  //     fs.appendFileSync(
  //       'uploads/' + name,
  //       fs.readFileSync(chunkDir + '/' + chunkPath),
  //     );
  //     fs.rmSync(chunkDir + '/' + chunkPath);
  //   });
  //   fs.rmdirSync(chunkDir);
  // }
  @Get('merge')
  async mergeFiles(
    @Query('name') name: string,
    //@Query('totalChunks') totalChunks: string,
  ) {
    const chunkDir = 'uploads/chunks_' + name;

    try {
      const chunkPaths = await fs.promises.readdir(chunkDir);

      // // 验证切片数量
      // if (chunkPaths.length !== parseInt(totalChunks)) {
      //   throw new Error(
      //     `切片数量不正确: 期望 ${totalChunks} 个，实际 ${chunkPaths.length} 个`,
      //   );
      // }

      // // 验证所有切片是否都存在
      // const numbers = chunkPaths.map((path) => parseInt(path.split('-')[1]));
      // for (let i = 1; i <= parseInt(totalChunks); i++) {
      //   if (!numbers.includes(i)) {
      //     throw new Error(`缺少第 ${i} 个切片`);
      //   }
      // }
      chunkPaths.sort(
        (a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]),
      );

      const writeStream = fs.createWriteStream('uploads/' + name);

      for (const chunkPath of chunkPaths) {
        const chunkContent = await fs.promises.readFile(
          chunkDir + '/' + chunkPath,
        );
        await new Promise((resolve, reject) => {
          writeStream.write(chunkContent, (error) => {
            if (error) reject(error);
            resolve(true);
          });
        });
        await fs.promises.unlink(chunkDir + '/' + chunkPath);
      }

      writeStream.end();
      await fs.promises.rmdir(chunkDir);

      return {
        code: 200,
        message: '文件合并成功',
      };
    } catch (error) {
      throw new Error(`合并失败: ${error.message}`);
    }
  }
}
