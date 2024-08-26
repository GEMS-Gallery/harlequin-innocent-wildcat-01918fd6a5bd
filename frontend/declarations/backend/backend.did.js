export const idlFactory = ({ IDL }) => {
  const Chain = IDL.Text;
  const Balance = IDL.Float64;
  const TransactionResult = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'authenticate' : IDL.Func([], [IDL.Text], []),
    'getBalance' : IDL.Func([Chain], [IDL.Opt(Balance)], []),
    'getTokenUtilities' : IDL.Func([], [IDL.Text], []),
    'initTestData' : IDL.Func([], [], []),
    'sendTransaction' : IDL.Func(
        [Chain, IDL.Float64, IDL.Text],
        [TransactionResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
