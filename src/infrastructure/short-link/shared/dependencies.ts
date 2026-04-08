import { ShortLinkController } from '../controller/short-link-controller'
import { serviceContainer } from './service-container'

export const shortLinkController = new ShortLinkController(serviceContainer)
