class CustomError extends Error {
    constructor(type, { message, code }) {
      console.log(message, code, "constructor error");
      super(message);
      this.name = this.constructor.name;
      this.type = type;
      this.code = code || null;
      console.log(this.constructor.name, "this", this.constructor);
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends CustomError {
    constructor({ message, code }) {
      super("ValidationError", { message, code });
    }
  }
  
  class NotFoundError extends CustomError {
    constructor({ message, code }) {
      console.log(message, code, "error");
      super("NotFoundError", { message, code });
    }
  }
  
  class UnAuthorisedError extends CustomError {
    constructor({ message, code }) {
      super("UnAuthorisedError", { message, code });
    }
  }
  
  class ConflictError extends CustomError {
    constructor({ message, code }) {
      super("ConflictError", { message, code });
    }
  }
  
  module.exports = {
    ValidationError,
    NotFoundError,
    UnAuthorisedError,
    ConflictError,
  };
  