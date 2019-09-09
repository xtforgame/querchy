import { QcRequestActionCreators, QcRequestConfigNormal } from '../core/interfaces';
import { RequestObservableOptions, SendRequestFunction } from './interfaces';
declare const _default: (sendRequest: SendRequestFunction, requestConfig: QcRequestConfigNormal, { success: successAction, error: errorAction, cancel: cancelAction, }: Partial<QcRequestActionCreators>, options: RequestObservableOptions) => any;
export default _default;
