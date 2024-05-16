import { Request, Response } from "express";
import { AuthenticationService } from "../services/authenticationService";
import { UserService } from "../services/userService";
import { encrypt } from "../utils/crypt"
import UserDTO from "../dtos/userDTO";
import AuthDTO from "../dtos/authenticationDTO";
import { ValidationUtils } from "../utils/validationUtils";
import { sendEmail } from "../utils/emailService";
import { decrypt } from "../utils/crypt"
const userService = new UserService();

export class AuthenticationController {
  
    async register(req: Request, res: Response) {
      try {
        const userData: UserDTO = new UserDTO(req.body);
        const user = await userService.createUser(userData);
        return res.status(201).json(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  
    async login(req: Request, res: Response) {
      try {
        const loginData: AuthDTO = new AuthDTO(req.body);
        const { email, password } = loginData;
        const user = await userService.getUserByEmail(email);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        const isPasswordValid = await userService.comparePassword(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }
        
        // encryptar o id do usuário
        const encryptedId = encrypt(user.id);

        const token = await AuthenticationService.generateToken(encryptedId);
        
        return res.status(200).json({ user: {id: user.id, email: user.email},token, message: "Login successful"});  
        // Levar isso tudo para o service e receber somente isso:
        //const token = await AuthenticationService.login(email, password);
       // return res.status(200).json({ token });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    //forgotPassword
    async forgotPassword(req: Request, res: Response) {
      try {
        const email  = ValidationUtils.validateEmail(req.body.email);
        const user = await userService.getUserByEmail(email);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        // enviar email com o link para resetar a senha
        // Enviar e-mail com o link de redefinição de senha com um serviço de e-mail, Nodemailer
        const encryptedId = encrypt(user.id);
        const resetToken = await AuthenticationService.generateResetToken(encryptedId, email);
        await sendEmail(email, "Reset your password", `<a href="http://localhost:3000/auth/reset-password?token=${resetToken}">Click here to reset your password</a>`);
        return res.status(200).json({ message: "Email sent" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    //resetPassword
    async resetPassword(req: Request, res: Response) {
      try {
        // passar o DTO na senha
        const { token, password } = req.body;
        console.log(token);
        // fazer validação de 2 senhas no service

        //const { userId, email } = await AuthenticationService.validateResetToken(token);
        const decoded = await AuthenticationService.validateResetToken(token);
        const user = await userService.getUserById(decrypt(decoded.userID));
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        
        await userService.updateUserPassword(user.id, password);
        return res.status(200).json({ message: "Password updated" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

