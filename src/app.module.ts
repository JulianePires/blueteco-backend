import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { TableModule } from './table/table.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, MenuModule, TableModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
