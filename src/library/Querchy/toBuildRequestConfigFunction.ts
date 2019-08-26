import {
  CommonConfig,
  ModelMap,
  QcRequestConfig,
  BuildRequestConfigContext,
  BuildRequestConfigMiddleware,
  BuildRequestConfigFunction,
  BuildRequestConfig,
} from '../core/interfaces';

const reduceMiddlewares = <
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
>(
  buildRequestConfigMiddlewares : BuildRequestConfigMiddleware<
    CommonConfigType,
    ModelMapType
  >[],
) : BuildRequestConfigFunction<
  CommonConfigType,
  ModelMapType
> => {
  let requestConfigFinal : QcRequestConfig | undefined;
  const makeNextFunction = (
    context : BuildRequestConfigContext<CommonConfigType, ModelMapType>,
    index : number,
  ) : ((requestConfigArg?: QcRequestConfig) => QcRequestConfig) => {
    if (index >= buildRequestConfigMiddlewares.length) {
      return (
        requestConfigArg?: QcRequestConfig,
      ) => requestConfigArg === undefined
        ? (requestConfigFinal || null) : requestConfigArg;
    }
    return (
      requestConfigArg?: QcRequestConfig,
    ) => requestConfigFinal = buildRequestConfigMiddlewares[index](
      {
        ...context,
        requestConfig: requestConfigArg === undefined ? requestConfigFinal : requestConfigArg,
      },
      makeNextFunction(context, index + 1),
    );
  };
  return (
    context : BuildRequestConfigContext<CommonConfigType, ModelMapType>,
  ) => makeNextFunction(context, 0)();
};

export default <
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
>(
  buildRequestConfig : BuildRequestConfig<
    CommonConfigType,
    ModelMapType
  >,
) : BuildRequestConfigFunction<
  CommonConfigType,
  ModelMapType
> => {
  if (Array.isArray(buildRequestConfig)) {
    return reduceMiddlewares(buildRequestConfig);
  }
  return buildRequestConfig;
};
