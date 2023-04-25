import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';

// INFO1: This is the function that will be called when the user clicks the "Create Account" button
export const issueTokens = async (
  tokenName: string,
  tokenSymbol: string,
  supply: number
) => {
  const transaction = {
    value: 50000000000000000,
    data: `issueFungibleToken@${toHex(tokenName)}@${toHex(tokenSymbol)}@${toHex(
      supply.toString()
    )}`,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Processing Transaction',
      errorMessage: 'An error has occured during transaction',
      successMessage: 'Transaction successful'
    },
    redirectAfterSign: false
  });
  return sessionId;
};

// INFO2: This is the function that will be called when the user clicks the "Buy Experience" button
export const onBuyExperience = async (amount: number) => {
  const transaction = {
    value: 0,
    data: `buyExperience@${toHex(amount.toString())}`,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Processing Transaction',
      errorMessage: 'An error has occured during transaction',
      successMessage: 'Transaction successful'
    },
    redirectAfterSign: false
  });
  return sessionId;
};

export const generateNFT = async (name: string, symbol: string) => {
  const transaction = {
    value: 50000000000000000,
    data: `sftIssue@${toHex(name)}@${toHex(symbol)}`,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Processing Transaction',
      errorMessage: 'An error has occured during transaction',
      successMessage: 'Transaction successful'
    },
    redirectAfterSign: false
  });
  return sessionId;
};

export const onAllowMe = async (expSymbol: string) => {
  const transaction = {
    value: 0,
    data: `setLocalRoles@${toHex(expSymbol)}`,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Processing Transaction',
      errorMessage: 'An error has occured during transaction',
      successMessage: 'Transaction successful'
    },
    redirectAfterSign: false
  });
  return sessionId;
};

export const onCreateNFT = async () => {
  const transaction = {
    value: 0,
    data: `createNft`,
    receiver: contractAddress,
    gasLimit: '60000000'
  };
  await refreshAccount();

  const { sessionId /*, error*/ } = await sendTransactions({
    transactions: transaction,
    transactionsDisplayInfo: {
      processingMessage: 'Processing Transaction',
      errorMessage: 'An error has occured during transaction',
      successMessage: 'Transaction successful'
    },
    redirectAfterSign: false
  });
  return sessionId;
};

function toHex(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}
