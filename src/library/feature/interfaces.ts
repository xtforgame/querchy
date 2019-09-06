// https://stackoverflow.com/questions/54701874/variadic-generic-types-in-typescript
import { State, ActionsObservable, StateObservable } from 'pure-epic';
import { Observable } from 'rxjs';

import {
  QcAction,
  QcState,
  RunnerType,
  ModelRootState,
  ResourceMerger,
} from '../common/interfaces';

import {
  CommonConfig,
  ModelMap,
  QueryBuilderDefinition,
  QueryBuilderMap,
  QuerchyDefinition,
  QcDependencies,
  ExtraActionCreators,

  QcBasicAction,
  StartQueryActionCreatorWithProps,
  QueryInfo,
  ActionInfo,
  BuildRequestConfigMiddleware,
} from '../core/interfaces';

export interface FeatureTypes {
  QueryInfos: {
    [s : string]: QueryInfo<Function>;
  };
  ActionInfos: {
    [s : string]: ActionInfo<Function>;
  };
}

export interface Feature<TypesType extends FeatureTypes = FeatureTypes> {
  Types: TypesType;
  getQueryInfos : () => TypesType['QueryInfos'];
  getActionInfos : () => TypesType['ActionInfos'];
  getBuildRequestConfigMiddleware : <
    CommonConfigType extends CommonConfig,
    ModelMapType extends ModelMap<CommonConfigType>
  >() => BuildRequestConfigMiddleware<CommonConfigType, ModelMapType>;
}
