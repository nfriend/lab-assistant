// from https://stackoverflow.com/a/47781245/1063392

let dateNowSpy: any;

beforeAll(() => {
  // Lock time to Sun Sep 01 2019 13:03:25 GMT-0300 (Atlantic Daylight Time)
  dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1567353793871);
});

afterAll(() => {
  // Unlock Time
  dateNowSpy.mockRestore();
});
