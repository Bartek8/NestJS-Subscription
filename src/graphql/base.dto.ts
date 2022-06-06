export abstract class BaseDto<T = Record<string, any>> {
  constructor(props: Extract<T, T>) {
    Object.assign(this, props);
  }
}
