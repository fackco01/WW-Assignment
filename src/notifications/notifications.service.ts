import { Injectable } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { NewUserEvent } from "../events/new-user.event";

@Injectable()
export class NotificationsService {

  @OnEvent('user.registered')
  async notifyNewUser(payload: NewUserEvent){
    console.log(`Hello user, ${payload.name}. Enjoy.`);
  }
}
