import { Controller, Get, Logger, Req, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { JwtAuthGuard } from "./feature/auth/auth.guard"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get("/auth/protected")
  @UseGuards(JwtAuthGuard)
  protected(@Req() req: Request): {
    message: string
  } {
    Logger.log(`Authenticated user: ${JSON.stringify(req)}`)
    return {
      message: "AuthGuard works 🎉",
    }
  }
}
