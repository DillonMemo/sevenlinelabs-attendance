import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { JwtAuthGuard } from "./auth.guard"
import { SupabaseStrategy } from "./strategies/supabase.strategy"

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("SUPABASE_JWT_SECRET_KEY"),
        signOptions: { expiresIn: "30m" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthGuard, SupabaseStrategy],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
