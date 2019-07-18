import {
  RunnerType,
} from '~/common/interfaces';

export type CommonConfig = {
  queryPrefix?: string;
  [s : string] : any;
};

export type ModelMap<CommonConfigType extends CommonConfig> = {
  [s : string] : any;
};

export type RequestConfig = {
  rawConfig?: any;
  method : string;
  url : string;
  headers?: { [s : string] : string };
  query?: { [s : string] : any };
  body?: any;
};

export type QueryCreatorDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  buildRequestConfig : (runnerType : RunnerType, commonConfig : CommonConfigType) => RequestConfig;
};

export type QueryCreatorMap<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>
> = {
  [s : string] : QueryCreatorDefinition<CommonConfigType, ModelMapType> | undefined;
};

export interface QuerchyDefinition<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<CommonConfigType, ModelMapType>
> {
  commonConfig : CommonConfigType;
  models : ModelMapType;
  queryCreators : QueryCreatorMapType;
}

export type QcDependencies<
  CommonConfigType extends CommonConfig,
  ModelMapType extends ModelMap<CommonConfigType>,
  QueryCreatorMapType extends QueryCreatorMap<CommonConfigType, ModelMapType>,
  QuerchyDefinitionType extends QuerchyDefinition<CommonConfigType, ModelMapType, QueryCreatorMapType>,
  ExtraDependencies = any,
> = ExtraDependencies & {
  querchyDef : QuerchyDefinitionType;
};
