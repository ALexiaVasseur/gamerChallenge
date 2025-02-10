export function controllerWrapper(middlewareFunction) {
    return async (req, res, next) => {
      try {
        // Wrap the controller call in a global try/catch, in case of unexpected error (dev mistake, database crash, ...)
        await middlewareFunction(req, res, next);
      } catch (error) {
        // Pass the handled error to the next middleware : our global error handler
        next(error); 
      }
    };
  }