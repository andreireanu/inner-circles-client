export interface SetUpCreatorProps {
  name: string;
  email: string;
  tokenName: string;
  tokenSymbol: string;
  twitter?: string;
  instagram?: string;
}

interface MockSetUpCreatorResponse {
  succeed: boolean;
  message: string;
}

export const MockSetUpCreator = ({
  name,
  email,
  tokenName,
  tokenSymbol,
  twitter,
  instagram
}: SetUpCreatorProps): MockSetUpCreatorResponse => {
  // This is a mock to setUp a creator

  if (!name || !email || !tokenName || !tokenSymbol)
    return {
      succeed: false,
      message:
        'The name, email, token name and token symbol fields are mandatory'
    };

  if (name === 'test')
    return {
      succeed: false,
      message: 'This name is already use'
    };

  if (tokenName === 'test')
    return {
      succeed: false,
      message: 'This token name is already use'
    };

  if (tokenSymbol === 'tst')
    return {
      succeed: false,
      message: 'This token symbol is already use'
    };

  return {
    succeed: true,
    message: 'Creator was created'
  };
};

export default MockSetUpCreator;
