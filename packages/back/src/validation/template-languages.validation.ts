import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { languageList } from 'src/utils/languages';

@ValidatorConstraint({ name: 'validateListOfLanguages', async: false })
export class LanguageValidator implements ValidatorConstraintInterface {
  validate(languagesStr: string, message: ValidationArguments) {
    if (!languagesStr) return false;
    const languages = languagesStr.split(',');
    if (languages.length < 1 || languages.length > 5) {
      return false;
    }
    for (let i = 0; i < languages.length; i++) {
      if (!languageList.includes(languages[i])) return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Templates should have minimum 1 or maximun 5 of  these ${languageList} languages `;
  }
}
