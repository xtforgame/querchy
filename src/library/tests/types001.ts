import {
  QcAction,
} from '../index';

import {
  typeHelperClass001,
} from './typesDef001';

// ===========================================

export class MyAxiosRunner001 extends typeHelperClass001.GetAxiosRunnerClass() {}

export class MyQuerchy001 extends typeHelperClass001.GetQuerchyClass() {}

export class MyCacher001 extends typeHelperClass001.GetCacherClass() {
  // reduce(action: QcAction, state: any) : any {
  //   return super.reduce(action, state);
  // }
}
