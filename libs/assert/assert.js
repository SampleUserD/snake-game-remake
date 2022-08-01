const AssertionStatuses = Object.freeze({ Failed: 'failed', Succesful: 'succesful' });


class Assertion
{
  #_status = AssertionStatuses.Failed;
  #_expectation = undefined;
  #_result = undefined;

  constructor(status, expectation, result)
  {
    this.#_status = status;
    this.#_expectation = expectation;
    this.#_result = result;
  }

  get Status()
  {
    return this.#_status;
  }

  get Expectation()
  {
    return this.#_expectation;
  }

  get Result()
  {
    return this.#_result;
  }
}

function Isolate(callback)
{
  Expect(Assert(callback instanceof Function, true));

  return function _isolate(arguments)
  {
    try
    {
      callback.apply(callback, arguments);
      return AssertionStatuses.Succesful;
    }
    catch(error) 
    {
      return AssertionStatuses.Failed;
    }
  }
}

function Assert(statement, expected)
{
  const status = (statement === expected) ? AssertionStatuses.Succesful : AssertionStatuses.Failed;

  return new Assertion(status, statement, expected);
}

function Expect(statement)
{
  if (!statement instanceof Assertion)
  {
    throw new Error('Expect(statement: Assertion) throws (Error | AssertionError)');
  }
  
  if (statement.Status == AssertionStatuses.Failed)
  {
    throw new AssertionError(statement.Expectation, statement.Result, statement.Status);
  }    
}

function Test(callback)
{
  return function _test(arguments, expectation)
  {
    try
    {
      return Check(callback.apply(callback, arguments), expectation);
    }
    catch (error)
    {
      return new Assertion(AssertionStatuses.Failed, expectation, error.message);
    }
  }
}