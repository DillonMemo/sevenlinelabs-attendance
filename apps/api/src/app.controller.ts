import { Controller, Get, Logger, Req, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { JwtAuthGuard } from "./feature/auth/auth.guard"
import { type AuthUser } from "@supabase/supabase-js"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get("/auth/protected")
  @UseGuards(JwtAuthGuard)
  async protected(@Req() req: Request & { user: AuthUser }) {
    Logger.log(`1️⃣`)
    const response = await this.appService.Protected(req.user)
    Logger.log(`AuthGuard works 🎉 ${JSON.stringify(response)}`)
    return response
  }
}
