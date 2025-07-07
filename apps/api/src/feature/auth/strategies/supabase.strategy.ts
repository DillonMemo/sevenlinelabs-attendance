import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { type Request } from "express"

// !TODO
@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>("SUPABASE_JWT_SECRET_KEY")
    if (!secret) throw new Error("SUPABASE_JWT_SECRET_KEY is not defined")

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: any): Promise<any> {
    Logger.log(`payload: ${JSON.stringify(payload)}`)
    return await Promise.resolve(payload)
  }

  authenticate(req: Request) {
    super.authenticate(req)
  }
}
