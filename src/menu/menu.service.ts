import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ItemCategory } from 'src/shared/enums';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDto } from './dto/item.dto';
import { ReturnItemDto } from './dto/return-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto): Promise<ReturnItemDto> {
    const itemNameExists = this.prismaService.item.findUnique({
      where: { name: createItemDto.name },
    });

    if (itemNameExists) {
      throw new ConflictException('Item is already on menu');
    }

    const createdItem = await this.prismaService.item.create({
      data: createItemDto,
    });

    return {
      item: {
        ...createdItem,
        price: Number(createdItem.price),
        category: ItemCategory[createdItem.category],
      },
      message: 'Item was added to the menu',
    };
  }

  async getMenu(): Promise<ItemDto[]> {
    const items = await this.prismaService.item.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const updatedItems: ItemDto[] = items.map((item) => {
      return {
        ...item,
        price: Number(item.price),
        category: ItemCategory[item.category],
      };
    });

    return updatedItems;
  }

  async findItem(itemId: string): Promise<ReturnItemDto> {
    const itemFinded = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    if (!itemFinded) {
      throw new NotFoundException('Item not found');
    }

    return {
      item: {
        ...itemFinded,
        price: Number(itemFinded.price),
        category: ItemCategory[itemFinded.category],
      },
      message: 'Item founded',
    };
  }

  async update(
    itemId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ReturnItemDto> {
    const itemFinded = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    if (!itemFinded) {
      throw new NotFoundException('Item not found');
    }

    if (updateItemDto.name) {
      const nameExists = await this.prismaService.item.findUnique({
        where: { name: updateItemDto.name },
      });

      if (nameExists) {
        throw new ConflictException('Item already exists');
      }
    }

    const updatedItem = await this.prismaService.item.update({
      where: { id: itemId },
      data: {
        name: updateItemDto.name,
        price: updateItemDto.price,
        category: updateItemDto.category,
      },
    });

    return {
      item: {
        ...updatedItem,
        price: Number(updatedItem.price),
        category: ItemCategory[updatedItem.category],
      },
      message: 'Item updated successfully',
    };
  }

  async delete(itemId: string): Promise<ReturnItemDto> {
    const itemFinded = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    if (!itemFinded) {
      throw new NotFoundException('Item not found');
    }

    const deletedItem = await this.prismaService.item.delete({
      where: { id: itemId },
    });

    return {
      item: {
        ...deletedItem,
        price: Number(deletedItem.price),
        category: ItemCategory[deletedItem.category],
      },
      message: 'Item deleted successfully',
    };
  }
}
