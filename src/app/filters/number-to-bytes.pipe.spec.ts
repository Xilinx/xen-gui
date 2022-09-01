import { NumberToBytesPipe } from './number-to-bytes.pipe';

describe('NumberToBytesPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToBytesPipe();
    expect(pipe).toBeTruthy();
  });
});
