import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '../entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser?.id.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const hasId = (params.id != null)
    const id = hasId ? Number(params.id) : undefined
    await this.pgUserRepo.save({
      id,
      email: hasId ? undefined : params.email,
      name: params.name,
      facebookId: params.facebookId
    })
  }
}
