import { Injectable, Logger } from "@nestjs/common"
import { type AuthUser } from "@supabase/supabase-js"
import { SupabaseService } from "./feature/supabase/supabase.service"

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return "Hello World!"
  }

  async Protected(user: AuthUser) {
    Logger.log(`2️⃣ ${JSON.stringify(user)}`)
    const response = await this.supabaseService
      .getClient()
      .from("profiles")
      .select("*")

    Logger.log(`3️⃣ ${JSON.stringify(response)}`)

    return {
      message: "AuthGuard works 🎉",
      user,
    }
  }
}
