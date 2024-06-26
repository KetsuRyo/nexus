import { BadRequestError } from "./errors.js";
import mongoose from "mongoose";
import emailValidator from "email-validator";
import xss from "xss";

class BaseValidator {
  static validateString = (_variable, _variableName) => {
    if (!_variable) {
      throw new BadRequestError(
        400,
        this.validateString.name,
        `Missing ${_variableName} field.`
      );
    }

    if (typeof _variable !== "string") {
      throw new BadRequestError(
        400,
        this.validateString.name,
        `Expected a string for ${_variableName}.`
      );
    }

    const variable = _variable.trim();
    if (variable.length === 0) {
      throw new BadRequestError(
        400,
        this.validateString.name,
        `Expected a nonempty string for ${_variableName}.`
      );
    }

    return variable;
  };

  static validateMongooseId = (_id, _idName) => {
    const id = this.validateString(_id, _idName);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError(
        400,
        this.validateMongooseId.name,
        `Expected a valid ObjectId for ${_idName}.`
      );
    }

    return xss(id);
  };
}

export class UserValidator extends BaseValidator {
  static minUsernameLength = 3;
  static maxUsernameLength = 20;
  static minPasswordLength = 8;
  static maxBioLength = 255;

  static validateSignupInfo = (_email, _username, _password) => {
    const email = this.validateString(_email, "email");
    const username = this.validateString(_username, "username");
    const password = this.validateString(_password, "password");

    if (!emailValidator.validate(email)) {
      throw new BadRequestError(
        400,
        this.validateSignupInfo.name,
        "Expected a valid email."
      );
    }

    if (
      username.length < this.minUsernameLength ||
      username.length > this.maxUsernameLength
    ) {
      throw new BadRequestError(
        400,
        this.validateSignupInfo.name,
        `Expected between ${this.minUsernameLength} and ${this.maxUsernameLength} characters without whitespace for username.`
      );
    }
    if (!/^[a-z0-9]+$/i.test(username)) {
      throw new BadRequestError(
        400,
        this.validateSignupInfo.name,
        "Expected only alphanumeric characters for username."
      );
    }

    if (
      password.length < this.minPasswordLength ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      throw new BadRequestError(
        400,
        this.validateSignupInfo.name,
        "Password must be at least 8 characters long and contain at least one uppercase letter and one special character."
      );
    }

    return {
      email: xss(email),
      username: xss(username),
      password: xss(password)
    };
  };

  static validateLoginCredentials = (_username, _password) => {
    const username = this.validateString(_username, "username");
    const password = this.validateString(_password, "password");

    return {
      username: xss(username),
      password: xss(password)
    };
  };

  static validateUpdateInfo = (_username, _bio, _theme) => {
    const username = this.validateString(_username, "username");
    const bio = _bio;
    const theme = this.validateString(_theme, "theme");

    if (
      username.length < this.minUsernameLength ||
      username.length > this.maxUsernameLength
    ) {
      throw new BadRequestError(
        400,
        this.validateUpdateInfo.name,
        `Username must be between ${this.minUsernameLength} and ${this.maxUsernameLength} alphanumeric characters.`
      );
    }
    if (!/^[a-z0-9]+$/i.test(username)) {
      throw new BadRequestError(
        400,
        this.validateUpdateInfo.name,
        "Username must contain only alphanumeric characters."
      );
    }

    if (bio && bio.length > this.maxBioLength) {
      throw new BadRequestError(
        400,
        this.validateUpdateInfo.name,
        `Bio must not exceed ${this.maxBioLength} characters.`
      );
    }

    if (theme !== "light" && theme !== "dark") {
      throw new BadRequestError(
        400,
        this.validateUpdateInfo.name,
        "Expected either 'light' or 'dark' for theme."
      );
    }

    return {
      username: xss(username),
      bio: xss(bio),
      theme: xss(theme)
    };
  };

  static validateCreateFriendRequestInfo = (_username) => {
    const username = this.validateString(_username, "username");

    return {
      username: xss(username)
    };
  };
}

export class ServerValidator extends BaseValidator {
  static validateCreationInfo = (_name, _description) => {
    const name = this.validateString(_name, "name");
    if (!name.match(/^[a-z0-9]{3,20}$/i)) {
      throw new BadRequestError(
        400,
        this.validateCreationInfo.name,
        "Name must be between 3 and 20 alphanumeric characters."
      );
    }

    const description = _description
      ? this.validateString(_description, "description")
      : "";
    if (description.length > 255) {
      throw new BadRequestError(
        400,
        this.validateCreationInfo.description,
        "Description must be at most 255 characters long."
      );
    }

    return {
      name: xss(name),
      description: xss(description)
    };
  };

  static validateUpdateInfo = (_name, _description) => {
    let name;
    if (_name) {
      name = this.validateString(_name, "name");
      if (!name.match(/^[a-z0-9]{3,20}$/i)) {
        throw new BadRequestError(
          400,
          this.validateUpdateInfo.name,
          "Name must be between 3 and 20 alphanumeric characters."
        );
      }
    }

    let description = _description
      ? this.validateString(_description, "description")
      : "";
    if (description.length > 255) {
      throw new BadRequestError(
        400,
        this.validateUpdateInfo.description,
        "Description must be at most 255 characters long."
      );
    }

    return {
      name: xss(name),
      description: xss(description)
    };
  };

  static validateUpdateUserInfo = (_permissionLevel) => {
    const permissionLevel = parseInt(_permissionLevel);
    if (Number.isNaN(permissionLevel) || typeof permissionLevel !== "number") {
      throw new BadRequestError(
        400,
        this.validateUpdateUserInfo.name,
        "Expected a number for permission level."
      );
    }

    if (permissionLevel < 0 || permissionLevel > 9) {
      throw new BadRequestError(
        400,
        this.validateUpdateUserInfo.name,
        "Permission level must be between 0 and 9 inclusive."
      );
    }
    return {
      permissionLevel: parseInt(xss(permissionLevel))
    };
  };
}

export class ChannelValidator extends BaseValidator {
  static validateChannelName = (_name) => {
    const name = this.validateString(_name, "name");
    if (!/^[a-z0-9]{3,20}$/i.test(name)) {
      throw new BadRequestError(
        400,
        this.validateChannelName.name,
        "Channel name must be between 3 and 20 alphanumeric characters."
      );
    }
    return name;
  };

  static validateDescription = (_description) => {
    if (typeof _description !== "string") {
      throw new BadRequestError(
        400,
        this.validateDescription.name,
        `Expected a string for description.`
      );
    }

    if (_description.trim().length > 255) {
      throw new BadRequestError(
        400,
        this.validateDescription.name,
        "Description must be at most 255 characters long."
      );
    }
    return _description.trim();
  };

  static validatePermissionLevel = (_permissionLevel) => {
    const permissionLevel = parseInt(_permissionLevel);
    if (
      Number.isNaN(permissionLevel) ||
      permissionLevel < 0 ||
      permissionLevel > 9
    ) {
      throw new BadRequestError(
        400,
        this.validatePermissionLevel.name,
        "Permission level must be between 0 and 9."
      );
    }
    return permissionLevel;
  };

  static validateCreationInfo = (_name, _description, _permissionLevel) => {
    const name = this.validateChannelName(_name);
    const description = this.validateDescription(_description);
    const permissionLevel = this.validatePermissionLevel(xss(_permissionLevel));

    return {
      name: xss(name),
      description: xss(description),
      permissionLevel: permissionLevel
    };
  };

  static validateUpdateInfo = (_name, _description, _permissionLevel) => {
    const name = this.validateChannelName(_name);
    const description = this.validateDescription(_description);
    const permissionLevel = this.validatePermissionLevel(xss(_permissionLevel));

    return {
      name: xss(name),
      description: xss(description),
      permissionLevel: permissionLevel
    };
  };
}

export class MessageValidator extends BaseValidator {
  static validateCreationInfo = (_channelId, _privateMessageId, _message) => {
    if (!_channelId && !_privateMessageId) {
      throw new BadRequestError(
        400,
        this.validateCreationInfo.name,
        "Message must belong to either a channel or a private message."
      );
    }

    if (_channelId && _privateMessageId) {
      throw new BadRequestError(
        400,
        this.validateCreationInfo.name,
        "Message cannot belong to both a channel and a private message."
      );
    }

    this.validateMessageLength(_message);

    if (_channelId) {
      const channelId = this.validateMongooseId(_channelId, "channelId");
      return {
        channelId: xss(channelId),
        message: xss(_message)
      };
    }

    const privateMessageId = this.validateMongooseId(
      _privateMessageId,
      "privateMessageId"
    );

    return {
      privateMessageId: xss(privateMessageId),
      message: xss(_message)
    };
  };

  static validateMessageLength = (_message) => {
    if (_message.length > 255) {
      throw new BadRequestError(
        400,
        this.validateMessageLength.name,
        "Message must be at most 255 characters long."
      );
    }
  };
}
export class PrivateMessageValidator extends BaseValidator {}
