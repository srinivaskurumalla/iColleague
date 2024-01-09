import { Injectable } from '@angular/core';
import * as dl from 'botframework-directlinejs';

@Injectable({
  providedIn: 'root',
})
export class DirectLineService {
  private directLine: any;

  constructor() {
    // Get the conversation ID from somewhere (e.g., a previous conversation)
    const conversationIdToSustain = '2b253ddf-1d87-43ac-aa77-b89573c84084';

    // Initialize Direct Line with your bot's local endpoint and conversation ID
    this.directLine = new dl.DirectLine({
      secret: '', // No secret needed for local development
      botAgent: 'botframework-webchat',  // Optional: Set the bot agent
      // Set the endpoint without the conversation ID, it will be appended automatically
    });
    // Set the endpoint without the conversation ID
    // Set the conversation ID and append it to the endpoint
   // Ensure that options is defined before setting properties
   if (this.directLine.options) {
    // Set the conversation ID and append it to the endpoint
    this.directLine.conversationId = conversationIdToSustain;
    this.directLine.options.endpoint = `http://localhost:3978/api/messages/conversations/${conversationIdToSustain}/activities`;
  }
    this.directLine.postActivity({ type: 'message', text: 'Hello, bot!' }).subscribe((response:any) => {
      const conversationId = response?.conversationId;
      console.log('New conversation ID:', conversationId);
    });
  }

 
  
  // Send a message to the bot
  sendMessage(message: string) {
    this.directLine.postActivity({
      from: { id: 'user' },
      type: 'message',
      text: message,
    }).subscribe(
      (id: any) => console.log("Posted activity, assigned ID ", id),
      (error: any) => console.log("Error posting activity", error)
    );
  }

  // Receive messages from the bot
  receiveMessage(callback: (message: any) => void) {
    this.directLine.activity$.subscribe(callback);
  }
}
