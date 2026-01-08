import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  // --- DOSYA YÜKLEME AYARLARI ---
  @ApiConsumes('multipart/form-data') // Swagger'a form-data göndereceğimizi söylüyoruz
  @UseInterceptors(FileInterceptor('file', { // 'file' frontend'deki input'un name'i olacak
    storage: diskStorage({
      destination: './uploads', // Dosyalar buraya kaydedilecek
      filename: (req, file, callback) => {
        // Dosya ismini benzersiz yap (random isim + uzantı)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  // ------------------------------
  create(@UploadedFile() file: Express.Multer.File, @Body() createEventDto: CreateEventDto) {
    // Eğer dosya yüklendiyse, DTO'daki imageUrl alanını güncelle
    if (file) {
      createEventDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }
    
    // NOT: DTO'dan gelen sayılar string olarak gelebilir (FormData yüzünden), onları çevirelim
    if (typeof createEventDto.categoryId === 'string') {
        createEventDto.categoryId = parseInt(createEventDto.categoryId);
    }

    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.eventsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}