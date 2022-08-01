class InterfaceImplementationError extends Error
{
  constructor(base, name, methodRepresentation)
  {
    super(`${ base }.${ methodRepresentation } is not implemented in ${ name }`);
  }
}