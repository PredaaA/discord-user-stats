function defaultResponse(success: boolean = true, message: string | null = null, data: object = {}) {
    return { success: success, message: message, data: data }
}

export default defaultResponse
