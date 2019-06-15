# Sipgate Adapter

[![Build Status](https://travis-ci.org/tim-hellhake/sipgate-adapter.svg?branch=master)](https://travis-ci.org/tim-hellhake/sipgate-adapter)
[![dependencies](https://david-dm.org/tim-hellhake/sipgate-adapter.svg)](https://david-dm.org/tim-hellhake/sipgate-adapter)
[![devDependencies](https://david-dm.org/tim-hellhake/sipgate-adapter/dev-status.svg)](https://david-dm.org/tim-hellhake/sipgate-adapter?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/sipgate-adapter/optional-status.svg)](https://david-dm.org/tim-hellhake/sipgate-adapter?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Send SMS from your Sipgate account.

## Configuration
1. Go to https://app.sipgatebasic.de/feature-store/sms-senden#book and enable the SMS feature for your account
2. Add your credentials to the config

## Usage
The addon registers a Sipgate device with a `Send SMS(application, event, description)` action.

Currently, a rule can only trigger parameterless actions.

To send Sipgate messages from a rule, you have to register an action with a predefined message.

Go to the settings of the addon and add an action with a name, a title and a body of your choice.

The Sipgate devices now provide a new action with the specified name you can use in a rule.
