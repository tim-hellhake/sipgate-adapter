/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { Notifier, Outlet, Database, Constants } from 'gateway-addon';

import fetch from 'node-fetch';

const crypto = require('crypto');

class SipgateOutlet extends Outlet {
  constructor(notifier: Notifier, private config: any, private recipient: any) {
    super(notifier, recipient.id);
    this.name = recipient.name;
  }

  async notify(_title: string, message: string, _level: Constants.NotificationLevel) {
    const {
      email,
      password,
      smsId
    } = this.config;

    const recipient = this.recipient;

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
  }
}

export class SipgateNotifier extends Notifier {
  constructor(addonManager: any, private manifest: any) {
    super(addonManager, 'sipgate', manifest.name);

    addonManager.addNotifier(this);
    this.load();
  }

  async load() {
    console.log('Loading config');
    const db = new Database(this.manifest.name);
    await db.open();
    const config = await db.loadConfig();

    if (config.recipients) {
      for (const recipient of config.recipients) {
        if (!recipient.id) {
          recipient.id = `${crypto.randomBytes(16).toString('hex')}`;
          console.log(`Generating id for ${recipient.name}`);
        }

        this.handleOutletAdded(
          new SipgateOutlet(this, config, recipient)
        );
      }
    }

    await db.saveConfig(config);

    return config;
  }
}
