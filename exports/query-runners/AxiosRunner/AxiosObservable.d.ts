import { AxiosStatic, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Observable } from 'rxjs';
import { QcRequestActionCreators } from '../../core/interfaces';
export interface AxiosObservableOptions {
    cancelStream$?: Observable<any>;
    axiosCancelTokenSource?: CancelTokenSource;
}
declare const _default: <Config extends AxiosRequestConfig = AxiosRequestConfig>(axios: AxiosStatic) => (axiosRequestConfig: Config, { success: successAction, error: errorAction, cancel: cancelAction, }?: Partial<QcRequestActionCreators>, options?: AxiosObservableOptions) => Observable<unknown>;
export default _default;
