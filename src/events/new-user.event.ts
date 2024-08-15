export class NewUserEvent{
  constructor(
    public username: string,
    public name: string,
    public roleId: number,
  ) {}
}
