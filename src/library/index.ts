import Querchy from '~/Querchy';
import AxiosRunner from '~/query-runners/AxiosRunner';

export default (data : any, err : any) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    const querchy = new Querchy(
      {
        commonConfig: {
          defaultQueryRunner: new AxiosRunner(),
          queryRunners: {
            xxxx: new AxiosRunner(),
          },
          queryPrefix: 'XX/',
        },
        models: {},
        queryCreators: {
          first: {
            queryRunner: 'xxxx',
            buildRequestConfig: (runnerType: string, commonConfig) => ({
              method: 'post',
              url: 'https://httpbin.org/post',
              query: {
                queryKey1: 1,
              },
              body: {
                dataKey1: 1,
              },
            }),
          },
        },
      },
    );
    querchy.testRun(resolve, data);
  });
};
