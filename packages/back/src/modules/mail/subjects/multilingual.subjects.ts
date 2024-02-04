type Languages = 'en' | 'ru' | 'mx' | 'br' | 'uk';

export class MultilingualSubjects {
  confirmEmail(language: Languages) {
    const subjects = {
      en: 'Welcome to Ellty! Confirm your Email.',
      ru: 'Добро пожаловать в Ellty! Подтвердите Вашу электронную почту.',
      mx: '¡Bienvenido a Ellty! Confirme su correo electrónico.',
      br: 'Bem-vindo à Ellty! Confirme seu e-mail.',
      uk: 'Ласкаво просимо до Ellty! Підтвердіть Вашу електронну пошту.',
    };
    return subjects[language];
  }

  resetPassword(language: string) {
    const subjects = {
      en: 'Reset Password.',
      ru: 'Сброс пароля.',
      mx: 'Restablecer contraseña.',
      br: 'Redefinir senha.',
      uk: 'Скинути пароль.',
    };
    return subjects[language];
  }

  newUser(language: string) {
    const subjects = {
      en: 'New User',
      ru: 'Новый пользователь',
      mx: 'Nuevo usuario',
      br: 'Novo Usuário',
      uk: 'Новий користувач',
    };
    return subjects[language];
  }

  updateEmail(language: string) {
    const subjects = {
      en: 'Change Email',
      ru: 'Изменение электронной почты',
      mx: 'Cambiar el email',
      br: `Alterar e-mail`,
      uk: 'Змінити електронну пошту',
    };
    return subjects[language];
  }

  tamplateStatus(language: string) {
    const subjects = {
      en: 'The status of your template has changed.',
      ru: 'Статус Вашего шаблона изменился.',
      mx: 'El estado de su plantilla ha cambiado.',
      br: 'O status do seu modelo mudou.',
      uk: 'Статус вашого шаблону змінено.',
    };
    return subjects[language];
  }
}
