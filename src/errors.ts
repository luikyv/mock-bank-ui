import { ref } from 'vue'

export enum ErrorCode {
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
}

export const globalError = ref<{
  message: string
  id?: string
} | null>(null)

export function handleError(err: unknown) {
  switch (true) {
    case err instanceof ErrorInfo:
      console.log(err.interactionId)
      switch (err.code) {
        case ErrorCode.USER_ALREADY_EXISTS:
          globalError.value = { id: err.interactionId, message: 'The user already exists' }
          break
        default:
          globalError.value = { id: err.interactionId, message: err.message }
          break
      }
      break
    default:
      console.log(err)
      globalError.value = {
        message: 'Something went wrong :(',
      }
  }
}

export class ErrorInfo extends Error {
  code: ErrorCode
  interactionId?: string
  constructor(code: ErrorCode, message: string, interactionId?: string) {
    super(message)
    this.code = code
    this.interactionId = interactionId
  }
}

export interface ResponseError extends Error {
  errors: {
    code: ErrorCode
    detail: string
  }[]
}
