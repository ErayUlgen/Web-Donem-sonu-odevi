import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false })
  findAll(@Query('name') name?: string) {
    return this.usersService.findAll(name);
  }

  // Kendi profilini ve favorilerini getir
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // --- FAVORİ İŞLEMLERİ ---
  
  @Post('favorites/:eventId') // Favoriye Ekle
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  addFavorite(@Request() req, @Param('eventId') eventId: string) {
    return this.usersService.addFavorite(req.user.userId, +eventId);
  }

  @Delete('favorites/:eventId') // Favoriden Çıkar
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  removeFavorite(@Request() req, @Param('eventId') eventId: string) {
    return this.usersService.removeFavorite(req.user.userId, +eventId);
  }
}