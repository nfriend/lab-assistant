import { defaultsDeep } from 'lodash';

export const createAlexaEvent = (diffs: any) => {
  const baseEvent = {
    version: '1.0',
    session: {
      new: true,
      sessionId: 'amzn1.echo-api.session.4501c251-e8d1-4149-882c-a2eaf7015f73',
      application: {
        applicationId: 'amzn1.ask.skill.ed086cac-45de-4652-8034-cc44df5c0297',
      },
      user: {
        userId:
          'amzn1.ask.account.AGTLTFSXVMA6ZWIHWFDQDDSD7XG23ZH5RMCYLGI6MCICYKPRVEJT7PZRQPPMZMEO5FEBDMV5TXPW2OYQQ2MQMNJILYRTSS4UKQIPVAODLIPWEA2BFBZEWBW5GHB5ZNUAVJYPNTGO4GPOIUW2DC57ZBAF6NT7UCZHFKEJCX7B73PKTMQ5APZ42HJJCICDFJQ5NBJAZXFALJUXXNY',
      },
    },
    context: {
      System: {
        application: {
          applicationId: 'amzn1.ask.skill.ed086cac-45de-4652-8034-cc44df5c0297',
        },
        user: {
          userId:
            'amzn1.ask.account.AGTLTFSXVMA6ZWIHWFDQDDSD7XG23ZH5RMCYLGI6MCICYKPRVEJT7PZRQPPMZMEO5FEBDMV5TXPW2OYQQ2MQMNJILYRTSS4UKQIPVAODLIPWEA2BFBZEWBW5GHB5ZNUAVJYPNTGO4GPOIUW2DC57ZBAF6NT7UCZHFKEJCX7B73PKTMQ5APZ42HJJCICDFJQ5NBJAZXFALJUXXNY',
          accessToken: 'test-access-token',
        },
        device: {
          deviceId:
            'amzn1.ask.device.AFZOKT3QB6R5SRQ2XGAKJBFL2XGLFPXAEYGO4EPKPJQZCLK46YYN3O3Y4TZM6OQ2CT5S45VMEUZC4PX6UAXQ7QP5UZD264J4XZNVPNY3XEFMV3ZS5UZKDUVMAPWBCXEECCK6MBWUE6U4M7LX7INQOJVY7PZOECSJACFPDWQSLMBDUYSECPQEW',
          supportedInterfaces: {},
        },
        apiEndpoint: 'https://api.amazonalexa.com',
        apiAccessToken:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLmVkMDg2Y2FjLTQ1ZGUtNDY1Mi04MDM0LWNjNDRkZjVjMDI5NyIsImV4cCI6MTU2NjUxNzExNywiaWF0IjoxNTY2NTE2ODE3LCJuYmYiOjE1NjY1MTY4MTcsInByaXZhdGVDbGFpbXMiOnsiY29udGV4dCI6IkFBQUFBQUFBQUFENWROdSs5d3YzdVZHdUtMKy8xakVLS3dFQUFBQUFBQURkcjlyQXkzWDZac0g1SHoyMFdNcE5KZDVtM2pVU09QZkgxZDVFZ1BkQ2VMZVpTb2RmT1RNOExCVXB3Q0Z6d3QwV3IrU1BuTVpqZnJwaXY3dkEvTU9MWHBFZkt0UWNvNWJ2T0ljY0g3S1dyQ29LNW40RlNFeHVYLzArWWNNdklrbjMzQWJmUGkyL2JtZW5yRHR0YW42Tk1FOGlSZVFXdnBEWW4wU2VhL0U1Nm1Nc24vVWo2Tit6c2phSDlhZGlCSERnR3pKSndZU0g2YWNLb25SMndBb3lvTUdZL0MyLyt6OWFJZHg4MjhVNVJVQVVHQ09zQU9BQmN4QlB3NnpqQnI2WTd2M2FjM08rYkhLaEhOaGhtbGN6MVlVMHBiSzNoWkYyMkFvUmlDT0xCWm9lcHhmWjVDTXJwSG1GMDkzWDRESXFtS1Z0cm9reVUxVXhIY3Z5eDBLMFN4MXhtVkxtUzZRTFlmTWtFMVNWQ0w3QVZCemtDdG53ajNrQWVPdEw1dUFyQjR2QmE0RHlGWTl6VWc9PSIsImNvbnNlbnRUb2tlbiI6bnVsbCwiZGV2aWNlSWQiOiJhbXpuMS5hc2suZGV2aWNlLkFGWk9LVDNRQjZSNVNSUTJYR0FLSkJGTDJYR0xGUFhBRVlHTzRFUEtQSlFaQ0xLNDZZWU4zTzNZNFRaTTZPUTJDVDVTNDVWTUVVWkM0UFg2VUFYUTdRUDVVWkQyNjRKNFhaTlZQTlkzWEVGTVYzWlM1VVpLRFVWTUFQV0JDWEVFQ0NLNk1CV1VFNlU0TTdMWDdJTlFPSlZZN1BaT0VDU0pBQ0ZQRFdRU0xNQkRVWVNFQ1BRRVciLCJ1c2VySWQiOiJhbXpuMS5hc2suYWNjb3VudC5BR1RMVEZTWFZNQTZaV0lIV0ZEUUREU0Q3WEcyM1pINVJNQ1lMR0k2TUNJQ1lLUFJWRUpUN1BaUlFQUE1aTUVPNUZFQkRNVjVUWFBXMk9ZUVEyTVFNTkpJTFlSVFNTNFVLUUlQVkFPRExJUFdFQTJCRkJaRVdCVzVHSEI1Wk5VQVZKWVBOVEdPNEdQT0lVVzJEQzU3WkJBRjZOVDdVQ1pIRktFSkNYN0I3M1BLVE1RNUFQWjQySEpKQ0lDREZKUTVOQkpBWlhGQUxKVVhYTlkifX0.Rzg8rj6gVlisB4-I-uy9WmdBlGvSKKkzgxXvGcil7UMni3XMoMNB-o5Idg1uAeGLu8G17fUzKx_IPqdk2DliunqTuLAHHWZKE_vL2PFALhvWYz6zHZFhN80w3hTdaC7pn8KqzTW-vTlHf4sHZZszYjR59le7Ed9jjMX63SyD32yww1-hRYhLlSd6nMr5wnaPrLymAgJ6m0TONv2GBAk98rLGKm71IKGIIkKm4aosfidIHZVCVmkXnCuUjzEuOmzWvwgcr0R_hD4TTMiGj1gxKUhHew2Uv_fBcb8OrpAOlqLxkCe_l8BTs9foYRufGEAgdxGz68BA86IcEVm3kKDNPA',
      },
      Viewport: {
        experiences: [
          {
            arcMinuteWidth: 246,
            arcMinuteHeight: 144,
            canRotate: false,
            canResize: false,
          },
        ],
        shape: 'RECTANGLE',
        pixelWidth: 1024,
        pixelHeight: 600,
        dpi: 160,
        currentPixelWidth: 1024,
        currentPixelHeight: 600,
        touch: ['SINGLE'],
        video: {
          codecs: ['H_264_42', 'H_264_41'],
        },
      },
    },
    request: {
      type: 'IntentRequest',
      requestId: 'amzn1.echo-api.request.3216adf3-c482-48e9-8bc0-c6bb72ed292d',
      timestamp: '2019-08-22T23:33:37Z',
      locale: 'en',
      shouldLinkResultBeReturned: false,
    },
  };

  return defaultsDeep({}, diffs, baseEvent);
};
