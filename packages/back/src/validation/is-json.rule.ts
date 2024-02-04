import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {Injectable} from "@nestjs/common";

@ValidatorConstraint({ name: 'IsJson', async: true })
@Injectable()
export class IsJsonRule implements ValidatorConstraintInterface {
    constructor(
    ) {}

    async validate(file:any) {
        console.log('enter',file)
        if (!file&&!file.mimetype.includes('json')){
            return true;
        }
        return  false
    }

    defaultMessage(args: ValidationArguments) {
        return `Must be json`;
    }
}

export function IsJson(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsJson',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsJsonRule,
        });
    };
}
