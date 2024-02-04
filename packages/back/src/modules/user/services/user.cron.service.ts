import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument, UserPlan, UserStatus} from "../../../schemas/user.schema";
import {Model} from "mongoose";
import {Payment, PaymentDocument} from "../../../schemas/payment.schema";
import {StripePayService} from "../../stripe-pay/services/stripe-pay.service";
import {PaypalPayService} from "../../paypal-pay/services/paypal-pay.service";
import {constants} from "../utils/constants";
import {FoldersService} from "../../folders/services/folders.service";
import * as s3 from '../../../vendor/s3';

@Injectable()
export class UserCronService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
                private folderService: FoldersService,
                private stripePayService: StripePayService,
                private paypalPayService: PaypalPayService
    )
    {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkDeleteUsers() {
        // console.log(configuration())
        const deletedUsers = await this.userModel.find({status: UserStatus.deleted}).exec()
        if (deletedUsers.length <= 0) return HttpStatus.NO_CONTENT

        for (let i = 0; i < deletedUsers.length; i++) {
            const user = deletedUsers[i]
            if (+new Date() >= user.restoreTime) {
                if (user.avatar !== constants.DEFAULT_USER_AVATAR) {
                    await s3
                      .drop({
                        key: user.avatar,
                        folder: 'avatars',
                      })
                      .catch((e) => console.error(e));
                }
                // const folders = await this.folderModel.find({user: user._id}).exec()
                //
                // if (folders.length >= 0){
                //     console.log("start del fold")
                //     //await this.folderService.deleteUserFolders(user)
                //     console.log("end del fold")
                // }



                if (user.plan === UserPlan.pro) {
                    const userPayment = await this.paymentModel.findOne({userId:user._id, status: "active"}).exec()
                    console.log("pro user")
                    if (userPayment.paymentType === "stripe") {
                        console.log("stripe cancel start")
                        await this.stripePayService.cancelSubscription(user)
                        console.log("stripe cancel end")
                    }
                    else {
                        //paypal

                        console.log("cancel start")
                        await this.paypalPayService.cancelSubscription(user._id)
                    }
                }

                console.log(" s delete many")
                await this.paymentModel.deleteMany({userId:user._id})
                await user.delete()
                console.log(" e delete many + user.delete")
            }
        }
        console.log(deletedUsers)

    }
}
