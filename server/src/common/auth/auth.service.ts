import bcrypt from 'bcrypt';
import { UserService } from '../../modules/user/user.service';
import { signJwt } from './jwt';

const userService = new UserService();

export class AuthService {
  async login(email: string, password: string) {
    const user = await userService.findByEmail(email);
    if (!user) throw new Error("Użytkownik nie istnieje");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Nieprawidłowe hasło");

    const token = signJwt({ userId: user.id, role: user.role });
    return { token, user };
  }
}
