import { CommonConfig, ModelMap, BuildRequestConfigFunction, BuildRequestConfig } from '../core/interfaces';
declare const _default: <CommonConfigType extends CommonConfig, ModelMapType extends ModelMap<CommonConfigType>>(buildRequestConfig: BuildRequestConfig<CommonConfigType, ModelMapType>) => BuildRequestConfigFunction<CommonConfigType, ModelMapType>;
export default _default;
