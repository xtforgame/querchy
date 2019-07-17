import {
  RunnerType,
} from '~/common/interfaces';

export type ModelMap = {
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

export type QueryCreatorDefinition<ModelMapType extends ModelMap> = {
  buildRequestConfig : (runnerType : RunnerType) => RequestConfig;
};

export type QueryCreatorMap<ModelMapType extends ModelMap> = {
  [s : string] : QueryCreatorDefinition<ModelMapType> | undefined;
};

export interface QuerchyDefinition<
  ModelMapType extends ModelMap,
  QueryCreatorMapType extends QueryCreatorMap<ModelMap>
> {
  models : ModelMapType;
  queryCreators : QueryCreatorMapType;
}

export interface QcDependencies<
  ModelMapType extends ModelMap,
  QueryCreatorMapType extends QueryCreatorMap<ModelMap>,
  QuerchyDefinitionType extends QuerchyDefinition<ModelMapType, QueryCreatorMapType>,
> {
  querchyDef : QuerchyDefinitionType;
}
