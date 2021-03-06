/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import fetch from 'node-fetch';

import { Adapter, Device } from 'gateway-addon';

class SipgateDevice extends Device {
  private callbacks: { [key: string]: (action: any) => void } = {};

  constructor(adapter: Adapter, manifest: any) {
    super(adapter, 'Sipgate');
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;

    const {
      email,
      password,
      smsId,
      messages
    } = manifest.moziot.config;

    if (!email) {
      console.warn('No email set');
    }

    if (!password) {
      console.warn('No password set');
    }

    if (!smsId) {
      console.warn('No smsId set');
    }

    this.addCallbackAction({
      title: 'Send SMS',
      description: 'Send a SMS',
      input: {
        type: 'object',
        properties: {
          recipient: {
            type: 'string'
          },
          message: {
            type: 'string'
          }
        }
      }
    }, async (action: any) => {
      const {
        recipient,
        message
      } = action.input;

      const auth = new Buffer(`${email}:${password}`).toString('base64');

      await fetch('https://api.sipgate.com/v2/sessions/sms', {
        method: 'post',
        body: JSON.stringify({
          smsId,
          recipient,
          message
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`
        },
      });
    });

    if (messages) {
      for (const messageInfo of messages) {
        const {
          name,
          recipient,
          message
        } = messageInfo;
        console.log(`Creating action for ${name}`);

        const auth = new Buffer(`${email}:${password}`).toString('base64');

        this.addCallbackAction({
          title: name,
          description: 'Send a sms',
        }, async () => {
          await fetch('https://api.sipgate.com/v2/sessions/sms', {
            method: 'post',
            body: JSON.stringify({
              smsId,
              recipient,
              message
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${auth}`
            },
          });
        });
      }
    }
  }

  addCallbackAction(description: any, callback: (action: any) => void) {
    this.addAction(description.title, description);
    this.callbacks[description.title] = callback;
  }

  async performAction(action: any) {
    action.start();

    const callback = this.callbacks[action.name];

    if (callback) {
      callback(action);
    } else {
      console.warn(`Unknown action ${action.name}`);
    }

    action.finish();
  }
}

export class SipgateAdapter extends Adapter {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, SipgateAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const sipgate = new SipgateDevice(this, manifest);
    this.handleDeviceAdded(sipgate);
  }
}
