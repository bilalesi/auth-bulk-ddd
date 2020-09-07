interface BaseUseCase<IRequest, IResponse> {
    run(request?: IRequest): IResponse | Promise<IResponse>
}

export default BaseUseCase;