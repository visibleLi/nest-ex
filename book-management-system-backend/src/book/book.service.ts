import { Injectable, Inject } from '@nestjs/common';
import { CreateBookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';
import { DbService } from 'src/db/db.service';

@Injectable()
export class BookService {
  constructor(private readonly dbService: DbService) {}

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const findBook = books.find((book) => book.name === createBookDto.name);
    if (findBook) {
      return 'This book already exists';
    }
    const book = new Book();
    book.id = books.length + 1;
    book.name = createBookDto.name;
    book.author = createBookDto.author;
    book.description = createBookDto.description;
    //book.cover = createBookDto.cover;
    books.push(book);
    await this.dbService.write(books);
    return book;
  }

  async findAll() {
    const books: Book[] = await this.dbService.read();
    return books;
  }

  async findOne(id: number) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      return 'This book does not exist';
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      return 'This book does not exist';
    }
    book.name = updateBookDto.name;
    book.author = updateBookDto.author;
    book.description = updateBookDto.description;
    //book.cover = updateBookDto.cover;
    await this.dbService.write(books);
    return book;
    //return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    const books: Book[] = await this.dbService.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      return 'This book does not exist';
    }
    const newBooks = books.filter((book) => book.id !== id);
    await this.dbService.write(newBooks);
    return newBooks;
  }
}
