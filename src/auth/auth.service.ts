import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signupDto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  signup(signupDto: SignupDto) {
    // vérifier si l'utilisateur est déjà inscrit

    // hasher le mot de passe

    //Enregistrer l'utilisateur dans la base de données

    // Envoyer un email de confirmation

    // retourner une reponse de succès
    return 'signup';
  }

  login() {
    return 'login';
  }
}
