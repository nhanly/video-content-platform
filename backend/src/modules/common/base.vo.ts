export abstract class BaseValueObject<T> {
  constructor(public readonly props: T) {
    Object.freeze(this);
  }
  public equals(vo?: BaseValueObject<T>): boolean {
    return !!vo && JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
