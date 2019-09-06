import { CommonConfig, ModelMap, BuildRequestConfigMiddleware, BuildRequestConfig } from '../core/interfaces';
declare const _default: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>(buildRequestConfig: BuildRequestConfig<CommonConfigType, ModelMapType>) => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
export default _default;
