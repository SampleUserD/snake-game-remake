class AssertionError extends Error
{
  constructor(actual, expected, status)
  {
    super(`Returns ${ actual }, but expected ${ expected } (status: ${ status })`);
  }
}