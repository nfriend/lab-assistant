import { LocalizationInterceptor } from '../src/interceptors/LocalizationInterceptor';

beforeAll(async () => {
  await new LocalizationInterceptor().process(<any>{
    requestEnvelope: {
      request: {
        locale: 'en',
      },
    },
  });
});
