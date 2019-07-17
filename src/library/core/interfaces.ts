export type ModelMap = {
  [s : string] : any;
};

export type QueryDefinition<ModelMapType extends ModelMap> = {};

export type QueryMap<ModelMapType extends ModelMap> = {
  [s : string] : QueryDefinition<ModelMapType>;
};
