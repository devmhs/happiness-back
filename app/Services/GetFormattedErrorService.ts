interface errorsI {
  field?: string
  message: string
}

class GetFormattedErrorService {
  public execute({ errors }) {
    const formattedErrors: errorsI[] = []
    Object.getOwnPropertyNames(errors).forEach((val) => {
      const tmp_error: errorsI = {
        field: val,
        message: errors[val][0],
      }
      formattedErrors.push(tmp_error)
    })
    return formattedErrors
  }
}

export default new GetFormattedErrorService()
