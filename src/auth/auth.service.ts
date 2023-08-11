import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signupDto';
import { from } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async signup(signupDto: SignupDto) {
    // vérifier si l'utilisateur est déjà inscrit
    const { email, password, username } = signupDto;
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

  login() {
    return 'login';
  }
}
