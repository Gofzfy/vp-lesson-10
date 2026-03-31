export class LoginTDO {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static generateIncorrectPair(): LoginTDO{
    return new LoginTDO('', '')
  }

  static generateCorrectPait(): LoginTDO{
    return new LoginTDO(process.env.USER || 'Missing USER env var', process.env.PASSWORD || 'Missing PASSWORD env var');
  }
}