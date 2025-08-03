export abstract class BaseEntity<TId> {
  protected constructor(public readonly id: TId) {}
  public equals(e?: BaseEntity<TId>): boolean {
    return !!e && e.id === this.id;
  }
}
