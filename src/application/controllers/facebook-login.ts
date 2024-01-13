import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, ok, serverError, unauthorized } from '../helpers'
import { RequiredFieldError } from '../errors'
import { AuthenticationError } from '@/domain/errors'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (accessToken instanceof AuthenticationError) {
        return unauthorized()
      }
      return ok({
        accessToken: accessToken.value
      })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
