import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.EMAIL_FROM || "notificaciones@yeyo.dev";

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export class EmailService {
  private client: Resend | null = null;

  constructor() {
    if (RESEND_API_KEY) {
      this.client = new Resend(RESEND_API_KEY);
    }
  }

  private getClient(): Resend {
    if (!this.client) {
      throw new Error(
        "RESEND_API_KEY is not configured in environment variables"
      );
    }
    return this.client;
  }

  async send(payload: EmailPayload): Promise<void> {
    const { to, subject, body } = payload;

    await this.getClient().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text: body,
    });
  }

  async sendMany(payloads: EmailPayload[]): Promise<void> {
    await Promise.all(payloads.map((payload) => this.send(payload)));
  }

  async sendLoginNotification(email: string, userName: string): Promise<void> {
    const now = new Date().toLocaleString("es-EC", {
      timeZone: "America/Guayaquil",
      dateStyle: "full",
      timeStyle: "short",
    });

    await this.send({
      to: email,
      subject: "Inicio de sesión - Sistema Pericial",
      body:
        `Sistema Pericial - Notificación de Acceso\n` +
        `=========================================\n\n` +
        `Usuario: ${userName}\n` +
        `Correo: ${email}\n` +
        `Fecha y hora: ${now}\n\n` +
        `Si no reconoces esta actividad, contacta inmediatamente al administrador del sistema.`,
    });
  }

  async sendVigenciaAlert(
    email: string,
    peritoName: string,
    details: string[]
  ): Promise<void> {
    const items = details.map((d) => `  - ${d}`).join("\n");

    await this.send({
      to: email,
      subject: "Alerta de vencimiento - Sistema Pericial",
      body:
        `Sistema Pericial - Alerta de Vencimiento\n` +
        `=========================================\n\n` +
        `Perito: ${peritoName}\n\n` +
        `Los siguientes documentos están próximos a vencer:\n` +
        `${items}\n\n` +
        `Por favor gestiona la renovación a la brevedad.`,
    });
  }

  async sendNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    await this.send({
      to: email,
      subject,
      body:
        `Sistema Pericial\n` +
        `================\n\n` +
        `${message}`,
    });
  }
}

export const emailService = new EmailService();
