import { LocalizationInterceptor } from '../src/interceptors/LocalizationInterceptor';

beforeAll(async () => {
  await new LocalizationInterceptor().process({
    requestEnvelope: {
      request: {
        locale: 'en',
      },
    },
  } as any);
});
