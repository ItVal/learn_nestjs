import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config/dist';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/signinDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;
    // vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) throw new ConflictException('User already exists');
    // hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    //Enregistrer l'utilisateur dans la base de données
    await this.prismaService.user.create({
      data: { username, email, password: hash },
    });
    // Envoyer un email de confirmation
    await this.mailerService.sendSignupEmilConfirmation(email);
    // retourner une reponse de succès
    return { data: 'User succesfully created' };
  }

  // login
  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    //vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user)
      throw new ConflictException('User not found or password incorect');
    //Comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new ConflictException('User not found or password incorect');

    // Retourner un token jwt
    const payload = {
      sub: user.userId,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get('JWT_SECRET_KEY'),
    });

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
}
