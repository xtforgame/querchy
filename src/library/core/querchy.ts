import {
  QueryMap,
  ModelMap,
} from './interfaces';

export interface QuerchyDefinition<
  ModelMapType extends ModelMap,
  QueryMapType extends QueryMap<ModelMap>
> {
  model: ModelMapType;
  queries: QueryMapType;
}
